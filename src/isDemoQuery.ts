interface DemoQuery {
  position: number
}

export function asDemoQuery(query: any): DemoQuery | undefined {
  if ('position' in query && typeof query.position === 'string') {
    const position = +query.position
    if (isNaN(position) || position >= 10) return undefined
    return {
      position,
    }
  }
  return undefined
}
