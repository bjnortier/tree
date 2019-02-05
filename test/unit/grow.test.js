import { Graph, alg } from '@dagrejs/graphlib'
import expect from 'expect'

class TreeGraph {
  constructor ({ seedSize = 10 } = {}) {
    this.nextId = 0
    this.g = new Graph({ directed: true })
    const seed = { id: String(this.nextId++), type: 'seed', size: seedSize }
    this.g.setNode(seed.id, seed)
  }

  get nodes () {
    return this.g
      .nodes()
      .sort((a, b) => {
        return parseInt(a) - parseInt(b)
      })
      .map(id => this.g.node(id))
  }

  step () {
    alg.preorder(this.g, 0).forEach(id => {
      const node0 = this.g.node(id)
      switch (node0.type) {
        case 'seed': {
          const seed0 = node0
          seed0.type = 'germinated'
          seed0.size -= 2
          const stem0 = { id: String(this.nextId++), type: 'stem', size: 1, angle: 0 }
          const root0 = { id: String(this.nextId++), type: 'taproot', size: 1, angle: 180 }
          const seed1 = { ...seed0, size: seed0.size - 2 }
          this.g.setNode(root0.id, root0)
          this.g.setNode(stem0.id, stem0)
          this.g.setEdge(seed1.id, stem0.id)
          this.g.setEdge(seed1.id, root0.id)
          break
        }
        case 'germinated': {
          const germinated0 = node0
          if (germinated0.size >= 2) {
            this.g.successors(germinated0.id).forEach(id => {
              this.g.node(id).size += 1
            })
            germinated0.size -= 2
          }
          break
        }
        case 'stem': {
          const stem0 = node0
          if ((stem0.size > 2) && (!this.g.successors(stem0.id).length)) {
            stem0.size -= 2
            const newStemA = { id: String(this.nextId++), type: 'stem', size: 1, angle: stem0.angle + 30 }
            const newStemB = { id: String(this.nextId++), type: 'stem', size: 1, angle: stem0.angle - 30 }
            this.g.setNode(newStemA.id, newStemA)
            this.g.setNode(newStemB.id, newStemB)
            this.g.setEdge(stem0.id, newStemA.id)
            this.g.setEdge(stem0.id, newStemB.id)
          }
          break
        }
        case 'taproot': {
          const taproot0 = node0
          if ((taproot0.size > 3) && (!this.g.successors(taproot0.id).length)) {
            taproot0.size -= 3
            const newTaproot = { id: String(this.nextId++), type: 'taproot', size: 1, angle: taproot0.angle }
            const newSideRootA = { id: String(this.nextId++), type: 'sideroot', size: 1, angle: taproot0.angle - 45 }
            const newSideRootB = { id: String(this.nextId++), type: 'sideroot', size: 1, angle: taproot0.angle - 45 }
            this.g.setNode(newTaproot.id, newTaproot)
            this.g.setNode(newSideRootA.id, newSideRootA)
            this.g.setNode(newSideRootB.id, newSideRootB)
            this.g.setEdge(taproot0.id, newTaproot.id)
            this.g.setEdge(taproot0.id, newSideRootA.id)
            this.g.setEdge(taproot0.id, newSideRootB.id)
          }
          break
        }
        default: {
          console.warn('no step rule for', node0.type)
        }
      }
    })
  }

  reduce (reducer, acc0) {
    const ids = alg.preorder(this.g, 0).map(id => parseInt(id))
    return ids.map(id => this.g.node(id)).reduce(reducer, acc0)
  }
}

describe('TreeGraph', () => {
  it('starts from a seed', () => {
    const g = new TreeGraph()
    expect(g.nodes).toEqual([
      { id: '0', type: 'seed', size: 10 }
    ])
  })

  it('grows a stem and root from a seed', () => {
    const g = new TreeGraph()
    g.step()
    expect(g.nodes).toEqual([
      { id: '0', type: 'germinated', size: 8 },
      { id: '1', type: 'stem', size: 1, angle: 0 },
      { id: '2', type: 'taproot', size: 1, angle: 180 }
    ])
    expect(g.reduce((acc, node) => {
      acc.push(node)
      return acc
    }, [])).toEqual([
      { id: '0', type: 'germinated', size: 8 },
      { id: '1', type: 'stem', size: 1, angle: 0 },
      { id: '2', type: 'taproot', size: 1, angle: 180 }
    ])
  })

  it('uses the seed for the stem and root ans tops growing seed is exhausted', () => {
    const g = new TreeGraph({ seedSize: 4 })
    g.step()
    g.step()
    expect(g.nodes).toEqual([
      { id: '0', type: 'germinated', size: 0 },
      { id: '1', type: 'stem', size: 2, angle: 0 },
      { id: '2', type: 'taproot', size: 2, angle: 180 }
    ])
    g.step()
    expect(g.nodes).toEqual([
      { id: '0', type: 'germinated', size: 0 },
      { id: '1', type: 'stem', size: 2, angle: 0 },
      { id: '2', type: 'taproot', size: 2, angle: 180 }
    ])
  })

  it('splits the stem when it grows bigger', () => {
    const g = new TreeGraph({ seedSize: 6 })
    g.step()
    g.step()
    g.step()
    expect(g.nodes).toEqual([
      { id: '0', type: 'germinated', size: 0 },
      { id: '1', type: 'stem', size: 1, angle: 0 },
      { id: '2', type: 'taproot', size: 3, angle: 180 },
      { id: '3', type: 'stem', size: 1, angle: 30 },
      { id: '4', type: 'stem', size: 1, angle: -30 }
    ])
  })

  it('splits the stem when it grows bigger', () => {
    const g = new TreeGraph({ seedSize: 6 })
    g.step()
    g.step()
    g.step()
    expect(g.nodes).toEqual([
      { id: '0', type: 'germinated', size: 0 },
      { id: '1', type: 'stem', size: 1, angle: 0 },
      { id: '2', type: 'taproot', size: 3, angle: 180 },
      { id: '3', type: 'stem', size: 1, angle: 30 },
      { id: '4', type: 'stem', size: 1, angle: -30 }
    ])
  })
})
