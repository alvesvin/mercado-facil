import type { State, WideEvent } from '@/types'
import { randomUUIDv7 } from 'bun'
import { createMiddleware } from 'hono/factory'
import { getConnInfo } from 'hono/bun'
import { endTime, startTime } from 'hono/timing'
import { db } from '@/db'
import { event as eventTable } from '@/db/schema'

export const wideEvents = createMiddleware<State>(async (c, next) => {
    const ts = Date.now();
    const id = randomUUIDv7()
    const url = new URL(c.req.url)
    const connInfo = getConnInfo(c)
    const sampling = 1.0
    let sampled = Math.random() < sampling

    c.res.headers.set('X-Event-Id', id)

    const auth = await c.var.auth().unwrapOr(undefined);

    const event: WideEvent = {
        id,
        ts,
        sampling,
        sampled,
        connInfo,
        auth,
        request: {
            url: {
                host: url.host,
                hostname: url.hostname,
                protocol: url.protocol,
                pathname: url.pathname,
                search: Array.from(url.searchParams.entries()).reduce((acc, [key, value]) => {
                    acc[key] ||= []
                    acc[key].push(value)
                    return acc
                }, {} as Record<string, string[]>),
            },
            ua: c.req.header('User-Agent') || '',
        }
    }

    c.set('event', event)

    let response: Response

    try {
        startTime(c, 'event.response')
        response = await next() as unknown as Response;
        endTime(c, 'event.response')

        event.response = {
            status: c.res.status,
        }
        event.metric = c.var.metric && {
            headers: c.var.metric.headers,
        }

        c.set('event', event)
        if (c.error) throw c.error;
    } catch (error) {
        sampled = true;
        response = new Response(null, { status: 500 })
    }

    if (sampled) {
        void db.insert(eventTable).values({
            id: event.id,
            ts: event.ts,
            data: event,
        }).catch((error) => {
            console.error(error)
        })
    }

    return response;
})