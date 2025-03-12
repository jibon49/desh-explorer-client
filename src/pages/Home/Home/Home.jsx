import React, { PureComponent } from 'react'
import Banner from '../Banner/Banner'
import PackageCards from '../PackageCards/PackageCards'

export class Home extends PureComponent {
  render() {
    return (
      <div>
        <Banner></Banner>
        <PackageCards></PackageCards>
      </div>
    )
  }
}

export default Home