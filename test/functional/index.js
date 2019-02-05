import React from 'react'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { Reset } from 'minimui'

import Protea from '../../src'

const White = createGlobalStyle`
  body {
    background-color: white;
  }
`

render(<div>
  <Reset />
  <White />
  <Protea symmetry={20} />
</div>, document.getElementById('contents'))
