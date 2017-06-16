// Simulate a flaky API around otherwise an otherwise synchronous `f()`.
const flakify = <T>(f: () => T): Promise<T> =>
  new Promise((resolve, reject) =>
    // We'll always take 200 * (1d10 + 1) ms to respond
    window.setTimeout(() => {
      try {

        // And ~20% of the time we'll fail
        if (Math.random() < 0.2) {
          throw new Error('Failed arbitrarily')
        }

        resolve(f())
      }
      catch (e) {
        return reject(e)
      }
    }, 200 + Math.random() * 2000)
  )

export type Api = {
  save(x: { message: Object }): Promise<null>,
  load(): (Promise<{ message: Object }>),
}

export const api: Api = {
  save: (data: { message: Object }): Promise<null> => flakify(() => {
      localStorage.setItem('__dataValue', JSON.stringify(data))
      return null
    }),
  load: (): Promise<{ message: Object }> => flakify(() => {
      const storedValue = JSON.parse(localStorage.getItem('__dataValue'));
      return {
        message: storedValue.message || {}
      }
    }),
}
