import React, { PureComponent } from 'react'
import Banner from '../Banner/Banner'
import PackageCards from '../PackageCards/PackageCards'
import Tours from '../Tours/Tours'
import Discover from '../Discover/Discover'
import ReadBefore from '../ReadBefore/ReadBefore'
import Review from '../Review/Review'

export class Home extends PureComponent {
  render() {
    return (
      <div>
        <Banner></Banner>
        <Tours></Tours>
        <PackageCards></PackageCards>
        <Discover></Discover>
        <ReadBefore></ReadBefore>
        <Review></Review>
      </div>
    )
  }
}

export default Home