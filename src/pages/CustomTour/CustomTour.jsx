import { PiStarFill } from "react-icons/pi";
import { DayPicker } from "react-day-picker";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import backImage from "../../assets/banner3.jpg";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Popover,
} from "@mui/material";
import Banner from "../Home/Banner/Banner";

const CustomTour = () => {
  // Custom Tour states
  const [leaveDate, setLeaveDate] = useState(null);
  const [serviceChoose, setService] = useState("");
  const [classValue, setClass] = useState("");
  const [name, setName] = useState("");
  const [pricePerNight] = useState(850);
  const [numRoom, setnumRoom] = useState(""); // previously null
  const [numGuests, setnumGuests] = useState(""); // previously null
  // NEW states for location selection
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  // Rental Cars states
  const [needRental, setNeedRental] = useState(false);
  const [rental, setRental] = useState("");
  // Changed priceMap to use numbers instead of strings.
  const seatMap = { 1: "4 seats", 2: "15 seats", 3: "25 seats" };
  const priceMap = { 1: 850, 2: 1200, 3: 1800 };
  // Compute rental price values.
  const rentalNumeric = rental ? priceMap[rental] : 0;
  const displayRentalPrice = rental ? `$${priceMap[rental]}` : "$0";
  const seatNumber = seatMap[rental] || "Select vehicle";
  const [hotels, setHotels] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [sortBy, setSortBy] = useState(""); // Sorting criteria
  const [numRooms, setNumRooms] = useState(1);
  const [numPersons, setNumPersons] = useState(1);
  const [totalHotelPrice, setTotalHotelPrice] = useState(0);

  // Transportation pricing
  const transportPriceMap = {
    "1-4": 50, // Bus - Business
    "1-5": 70, // Bus - First Class
    "1-6": 30, // Bus - Economy
    "2-4": 200, // Plane - Business
    "2-5": 300, // Plane - First Class
    "2-6": 150, // Plane - Economy
    "3-4": 80, // Train - Business
    "3-5": 120, // Train - First Class
    "3-6": 50, // Train - Economy
  };
  const transportPriceKey = `${serviceChoose}-${classValue}`;
  const transportpricePerNight = transportPriceMap[transportPriceKey] || 0;
  const totalTransportPrice = transportpricePerNight * (Number(numGuests) || 0);

  // Popover states for date pickers
  const [leaveAnchorEl, setLeaveAnchorEl] = useState(null);

  const handleLeaveClick = (event) => setLeaveAnchorEl(event.currentTarget);

  const handleClose = () => {
    setLeaveAnchorEl(null);
  };

  const handleRoomChange = (event) => {
    // Set raw value so input can be cleared
    setnumRoom(event.target.value);
  };
  const handleguestChange = (event) => {
    setnumGuests(event.target.value);
  };
  const totalPrice = selectedHotel
    ? selectedHotel.price * numRooms * numPersons
    : 0;
  const handleRentalChange = (event) => setRental(event.target.value);
  const [locations, setLocations] = useState([]);

  // NEW: Reset function to reset all states.
  const handleReset = () => {
    setLeaveDate(null);
    setService("");
    setClass("");
    setName("");
    setnumRoom("");
    setnumGuests("");
    setNeedRental(false);
    setRental("");
    setFromLocation("");
    setToLocation("");
    setNeedTransport(false);
  };

  // Add effective rental price calculation:
  const effectiveRentalNumeric = needRental ? rentalNumeric : 0;

  // NEW: Final Booking function that generates JSON and handles final booking
  const handleFinalBooking = () => {
    const bookingSummary = {
      bookingId: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      leaveDate: leaveDate ? leaveDate.toISOString() : null,
      from: fromLocation,
      to: toLocation,
      serviceChoose,
      classValue,
      provider: name,
      numRoom,
      numGuests,
      customTourTotal: totalPrice,
      transportationTotal: effectiveTransportTotal,
      rentalTotal: needRental ? rentalNumeric : 0,
      finalTotal:
        totalPrice + effectiveTransportTotal + (needRental ? rentalNumeric : 0),
    };
    console.log(JSON.stringify(bookingSummary));
    alert(JSON.stringify(bookingSummary, null, 2));
  };
  // useEffect(() => {
  //   fetch("hotels.json") // Fetch the JSON file
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setHotels(data); // Store all hotels
  //     })
  //     .catch((error) => console.error("Error fetching hotels:", error));
  // }, []);

  useEffect(() => {
    if (toLocation) {
      const locationData = hotels.find((item) => item.location === toLocation);
      if (locationData) {
        let sortedHotels = [...locationData.hotels];
        if (sortBy === "price") {
          sortedHotels.sort((a, b) => a.price - b.price);
        }
        setHotelList(sortedHotels);
        setSelectedHotel(sortedHotels[0] || null);
      } else {
        setHotelList([]);
        setSelectedHotel(null);
      }
    }
  }, [toLocation, hotels, sortBy]);

  useEffect(() => {
    if (selectedHotel) {
      setTotalHotelPrice(selectedHotel.price * numRooms);
    }
  }, [selectedHotel, numRooms]);

  useEffect(() => {
    fetch("hotels.json") // Replace with your actual API or JSON file path
      .then((response) => response.json())
      .then((data) => {
        setHotels(data);

        // Extract unique locations from the hotels data
        const uniqueLocations = [
          ...new Set(data.map((hotel) => hotel.location)),
        ];
        setLocations(uniqueLocations);
      })
      .catch((error) => console.error("Error fetching hotels:", error));
  }, []);

  // Add new state for transportation toggle:
  const [needTransport, setNeedTransport] = useState(false);

  // Calculate effective transportation total:
  const effectiveTransportTotal = needTransport ? totalTransportPrice : 0;

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Custom tour plan"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim adipisci consequuntur recusandae nulla iusto vitae fuga dolore! Perspiciatis, possimus eum."
      ></Banner>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Custom Tour Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg backdrop-blur-md bg-opacity-80 mt-6">
          <h2 className="text-3xl text-center text-gray-800 mb-8 font-bold">
            Custom Tour
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* From Location Selector */}
            <div className="p-4 rounded-lg bg-gray-50">
              <label className="font-semibold text-gray-700 mb-2 block">
                From
              </label>
              <FormControl fullWidth>
                <Select
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                >
                  {locations.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Leave Date Picker */}
            <div className="p-4 rounded-lg bg-gray-50">
              <label className="text-gray-600 block mb-2">Date of Travel</label>
              <Button
                onClick={handleLeaveClick}
                className="w-full text-left bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
              >
                {leaveDate ? leaveDate.toLocaleDateString() : "Pick a date"}
              </Button>
              <Popover
                open={Boolean(leaveAnchorEl)}
                anchorEl={leaveAnchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <DayPicker
                  mode="single"
                  selected={leaveDate}
                  onSelect={(date) => {
                    setLeaveDate(date);
                    handleClose();
                  }}
                  className="react-day-picker bg-white p-4 rounded-lg shadow border border-gray-200"
                  modifiersClassNames={{
                    selected: "bg-blue-500 text-white",
                    today: "font-bold",
                  }}
                  styles={{
                    root: { width: "100%" },
                    day: { borderRadius: "8px", padding: "8px" },
                    caption: { fontSize: "1.1rem", fontWeight: "bold" },
                    nav_button: { color: "#3b82f6" },
                  }}
                />
              </Popover>
            </div>
            {/* To Location Selector */}
            <div className="p-4 rounded-lg bg-gray-50">
              <label className="font-semibold text-gray-700 mb-2 block">
                To
              </label>
              <FormControl fullWidth>
                <Select
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                >
                  {locations.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button className="btn btn-primary text-white px-8 py-3 rounded-full hover:bg-[#90aab6] transition-all shadow-md">
              Search
            </button>
          </div>
        </div>
        <div className="divider my-12" />

        {/* Hotel Section */}
        <div className="p-4 rounded-lg bg-gray-50">
          <label className="font-semibold text-gray-700 mb-2 block">
            Select Hotel
          </label>
          <FormControl fullWidth>
            <Select
              value={selectedHotel ? selectedHotel.name : ""}
              onChange={(e) => {
                const hotel = hotelList.find((h) => h.name === e.target.value);
                setSelectedHotel(hotel);
              }}
              displayEmpty
            >
              {hotelList.length > 0 ? (
                hotelList.map((hotel, index) => (
                  <MenuItem key={index} value={hotel.name}>
                    <div className="flex items-center gap-3">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-10 h-10 rounded-md"
                      />
                      <span>
                        {hotel.name} - ${hotel.price}/night
                      </span>
                    </div>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hotels available</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
        {selectedHotel && (
          <div className="card bg-base-100 shadow-xl mt-6 p-4 flex flex-col sm:flex-row justify-between">
            {/* Left: Hotel Details */}
            <div className="flex items-center gap-6">
              <img
                src={selectedHotel.image}
                className="w-32 h-32 object-cover rounded-lg"
                alt={selectedHotel.name}
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedHotel.name}</h2>
                <p className="text-gray-600">
                  Price:{" "}
                  <span className="font-semibold">
                    ${selectedHotel.price}/night
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Booking Options */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Number of Rooms:</label>
              <input
                type="number"
                min="1"
                value={numRooms}
                onChange={(e) => setNumRooms(parseInt(e.target.value) || 1)}
                className="border p-2 rounded w-24"
              />

              <label className="font-semibold">Number of Persons:</label>
              <input
                type="number"
                min="1"
                value={numPersons}
                onChange={(e) => setNumPersons(parseInt(e.target.value) || 1)}
                className="border p-2 rounded w-24"
              />

              {/* Total Price Display */}
              <div className="mt-3">
                <h3 className="text-lg font-bold">
                  Total Price: ${numRooms * numPersons * selectedHotel.price}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="divider my-12" />

        {/* Transport Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 text-2xl font-bold">
              Transport Section
            </h2>
            {/* New Transportation Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Need Transportation Options?</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={needTransport}
                onChange={(e) => setNeedTransport(e.target.checked)}
              />
            </div>
            {needTransport ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormControl fullWidth>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={serviceChoose}
                    label="Service Type"
                    onChange={(e) => setService(e.target.value)}
                  >
                    <MenuItem value={1}>Bus</MenuItem>
                    <MenuItem value={2}>Plane</MenuItem>
                    <MenuItem value={3}>Train</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={classValue}
                    label="Class"
                    onChange={(e) => setClass(e.target.value)}
                  >
                    <MenuItem value={4}>Business</MenuItem>
                    <MenuItem value={5}>First Class</MenuItem>
                    <MenuItem value={6}>Economy</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={name}
                    label="Provider"
                    onChange={(e) => setName(e.target.value)}
                  >
                    <MenuItem value={7}>Abtravels</MenuItem>
                    <MenuItem value={8}>BC Travel</MenuItem>
                    <MenuItem value={9}>Ed Travels</MenuItem>
                  </Select>
                </FormControl>
                <input
                  type="number"
                  min="null"
                  value={numGuests}
                  onChange={handleguestChange}
                  className="input input-bordered w-full"
                  placeholder="Number of Guests"
                />

                <FormControl fullWidth>
                  <div className="space-y-2">
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        ${totalTransportPrice}
                      </p>
                      <p className="text-sm text-gray-500">
                        (${transportpricePerNight} × {numGuests} guests)
                      </p>
                    </div>
                  </div>
                </FormControl>
              </div>
            ) : (
              <Typography className="text-center text-gray-500 py-4">
                Enable transportation option to view available options
              </Typography>
            )}
          </div>
        </div>
        <div className="divider my-12" />

        {/* Rental Cars Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 text-2xl font-bold">
              Rental Section
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Need Rental Cars?</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={needRental}
                onChange={(e) => setNeedRental(e.target.checked)}
              />
            </div>
            {needRental ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormControl fullWidth>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    value={rental}
                    label="Vehicle Type"
                    onChange={handleRentalChange}
                  >
                    <MenuItem value={1}>Car</MenuItem>
                    <MenuItem value={2}>Micro Bus</MenuItem>
                    <MenuItem value={3}>Mini Bus</MenuItem>
                  </Select>
                </FormControl>
                <div className="bg-base-200 p-4 rounded-xl">
                  <div className="space-y-2">
                    <p className="badge badge-outline w-full">{seatNumber}</p>
                    <p className="text-2xl font-bold text-center">
                      {displayRentalPrice}
                      <span className="text-sm font-normal ml-2">
                        total rental
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Typography className="text-center text-gray-500 py-4">
                Enable rental car option to view available vehicles
              </Typography>
            )}
          </div>
        </div>

        <div className="divider my-12" />

        {/* New Final Summary Section */}
        <div className="bg-gradient-to-br from-blue-100 to-white p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-opacity-90 mt-12 border border-gray-200">
          <h2 className="text-3xl text-center text-gray-900 mb-6 font-extrabold tracking-wide">
            Final Booking Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Breakdown Section */}
            <div className="text-lg bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <p className="flex justify-between items-center border-b pb-2 text-gray-700">
                Hotel Cost Total:{" "}
                <span className="font-bold text-xl text-green-700">
                  ${totalPrice}
                </span>
              </p>
              <p className="flex justify-between items-center border-b pb-2 text-gray-700">
                Transportation Total:{" "}
                <span className="font-bold text-xl text-blue-700">
                  ${effectiveTransportTotal}
                </span>
              </p>
              <p className="flex justify-between items-center border-b pb-2 text-gray-700">
                Rental Total:{" "}
                <span className="font-bold text-xl text-purple-700">
                  ${needRental ? rentalNumeric : 0}
                </span>
              </p>
              <p className="flex justify-between items-center mt-4 text-xl font-semibold text-gray-900">
                Final Total:{" "}
                <span className="text-green-900 text-2xl">
                  $
                  {totalPrice +
                    effectiveTransportTotal +
                    (needRental ? rentalNumeric : 0)}
                </span>
              </p>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col items-center justify-center gap-6">
              <button
                onClick={handleFinalBooking}
                className="bg-green-500 text-white px-10 py-3 text-lg font-semibold rounded-full hover:bg-green-600 transition-all shadow-lg transform hover:scale-105"
              >
                Confirm Booking
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-10 py-3 text-lg font-semibold rounded-full hover:bg-gray-600 transition-all shadow-lg transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomTour;
