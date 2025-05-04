import React, { PureComponent } from "react";
import Banner from "../Banner/Banner";
import PackageCards from "../PackageCards/PackageCards";
import Tours from "../Tours/Tours";
import Discover from "../Discover/Discover";
import ReadBefore from "../ReadBefore/ReadBefore";
import Review from "../Review/Review";
import backImage from "../../../assets/banner.jpeg";
import backImage3 from "../../../assets/banner3.jpg";
import backImage4 from "../../../assets/banner4.png";
import backImage5 from "../../../assets/banner5.png";
import backImage6 from "../../../assets/tourbg.jpg";

export class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.bannerImages = [
      backImage,
      backImage3,
      backImage4,
      backImage5,
      backImage6
    ];
    this.state = {
      randomBanner: this.getRandomBanner()
    };
  }

  getRandomBanner = () => {
    const randomIndex = Math.floor(Math.random() * this.bannerImages.length);
    return this.bannerImages[randomIndex];
  };

  render() {
    return (
      <div>
        <Banner
          bgImage={this.state.randomBanner}
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