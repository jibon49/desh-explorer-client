import React, { PureComponent } from "react";
import Banner from "../Banner/Banner";
import PackageCards from "../PackageCards/PackageCards";
import Tours from "../Tours/Tours";
import Discover from "../Discover/Discover";
import ReadBefore from "../ReadBefore/ReadBefore";
import Review from "../Review/Review";
import { Helmet } from "react-helmet-async";
import backImage from "../../../assets/banner.jpeg";

export class Home extends PureComponent {
  render() {
    return (
      <div>
        <Helmet>
          <title>Desh | Home</title>
        </Helmet>
        <Banner

        bgImage={backImage}
          heading="Simplify Travel, Amplify Adventure"
          text="Plan your trips effortlessly with our seamless booking system. Explore new destinations and make unforgettable memories."
        ></Banner>
        <Tours></Tours>
        <PackageCards></PackageCards>
        <Discover></Discover>
        <ReadBefore></ReadBefore>
        <Review></Review>
      </div>
    );
  }
}

export default Home;
