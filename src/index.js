import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Protea extends Component {
  render () {
    const { symmetry } = this.props
    const indices = Array(symmetry).fill(0).map((x, i) => i)
    return <svg width='400' height='400' viewBox='-100 -100 200 200'>
      {indices.map(i => <g key={i}>
        <g fill={`hsl(${(i) / symmetry * 360}, 100%, 50%)`} transform={`rotate(${i / symmetry * 360})`}>
          <circle cx='10' cy='0' r='1' />
        </g>
        <g fill={`hsl(${(i) / symmetry * 360}, 100%, 50%)`} transform={`rotate(${i / symmetry * 360})`}>
          <circle cx='14' cy='0' r='1' />
        </g>
        <g transform={`rotate(${(i + 0.5) / symmetry * 360})`}>
          <circle cx='12' cy='0' r='1' />
        </g>
        <g transform={`rotate(${(i + 0.5) / symmetry * 360})`}>
          <path stroke='none' fill='#000' d='M 0 14 L 2 17 L 0 25 L -2 17' />
        </g>
        <g transform={`rotate(${i / symmetry * 360})`}>
          <path stroke='none' fill={`hsl(${(i) / symmetry * 60}, 100%, 50%)`} d='M 0 18 L 3 27 L 0 45 L -3 27' />
        </g>
      </g>)}
    </svg>
  }
}

Protea.propTypes = {
  symmetry: PropTypes.number.isRequired
}

export default Protea
