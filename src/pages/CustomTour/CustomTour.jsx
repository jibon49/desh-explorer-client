import { PiStarFill } from "react-icons/pi";
import { DayPicker } from "react-day-picker";
import { useState, useEffect } from "react";
import backImage from "../../assets/banner3.jpg";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Popover,
  Button,
} from "@mui/material";
import Banner from "../Home/Banner/Banner";
import { FaCar, FaBus, FaPlane, FaTrain } from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";
import { IoCalendarClearOutline } from "react-icons/io5";
import { MdHotel, MdDirectionsCar, MdDirectionsBus } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useMongoUser from "../../hooks/userMongoUser";

const CustomTour = () => {
  const axiosSecure = useAxiosSecure();

  const [leaveDate, setLeaveDate] = useState(null);
  const [serviceChoose, setService] = useState("");
  const [classValue, setClass] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [needRental, setNeedRental] = useState(false);
  const [rental, setRental] = useState("");
  const [needTransport, setNeedTransport] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [numRooms, setNumRooms] = useState(1);
  const [locations, setLocations] = useState([]);
  const [leaveAnchorEl, setLeaveAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const {mongoUser} = useMongoUser()

  const seatMap = {
    1: { name: "Car", seats: "4 seats", icon: <FaCar className="mr-2" /> },
    2: { name: "Micro Bus", seats: "15 seats", icon: <FaBus className="mr-2" /> },
    3: { name: "Mini Bus", seats: "25 seats", icon: <FaBus className="mr-2" /> },
  };
  const priceMap = { 1: 850, 2: 1200, 3: 1800 };
  const transportPriceMap = {
    "1-4": 50, "1-5": 70, "1-6": 30,
    "2-4": 200, "2-5": 300, "2-6": 150,
    "3-4": 80, "3-5": 120, "3-6": 50,
  };

  const rentalNumeric = rental ? priceMap[rental] : 0;
  const transportPriceKey = `${serviceChoose}-${classValue}`;
  const transportPricePerNight = transportPriceMap[transportPriceKey] || 0;
  const totalTransportPrice = transportPricePerNight * numGuests;
  const hotelPrice = selectedHotel ? selectedHotel.price * numRooms * numGuests : 0;
  const totalPrice = hotelPrice + (needTransport ? totalTransportPrice : 0) + (needRental ? rentalNumeric : 0);

  useEffect(() => {
    axiosSecure.get("/hotels")
      .then((res) => {
        setHotels(res.data);
        setLocations([...new Set(res.data.map((hotel) => hotel.location))]);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        Swal.fire("Error", "Failed to load hotels", "error");
      });
  }, [axiosSecure]);

  useEffect(() => {
    if (toLocation) {
      setFilteredHotels(hotels.filter((hotel) => hotel.location === toLocation));
    }
  }, [toLocation, hotels]);

  const handleSubmit = async () => {
    if (!leaveDate || !fromLocation || !toLocation || !selectedHotel) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const bookingData = {
      userEmail: mongoUser?.userMail,
      fromLocation,
      toLocation,
      travelDate: leaveDate,
      hotel: {
        id: selectedHotel._id,
        name: selectedHotel.name,
        rooms: numRooms,
        price: selectedHotel.price,
        total: hotelPrice,
      },
      transport: needTransport ? {
        type: ["Bus", "Plane", "Train"][serviceChoose - 1],
        class: ["", "", "", "Business", "First Class", "Economy"][classValue],
        guests: numGuests,
        price: totalTransportPrice,
      } : null,
      rental: needRental ? {
        type: rental,
        seats: seatMap[rental].seats,
        price: rentalNumeric,
      } : null,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const res = await axiosSecure.post("/usercustomtour", bookingData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Custom tour booked successfully!", "success");
        handleReset();
      }
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire("Error", "Failed to book the tour", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLeaveDate(null);
    setFromLocation("");
    setToLocation("");
    setService("");
    setClass("");
    setNumGuests(1);
    setNumRooms(1);
    setNeedRental(false);
    setRental("");
    setNeedTransport(false);
    setSelectedHotel(null);
  };

  console.log(hotels,mongoUser?.userMail)

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Design Your Perfect Tour"
        text="Customize every aspect of your journey with our flexible tour options"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Booking Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-12 border border-gray-100">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Build Your Custom Tour
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Location and Date Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-1 rounded-lg">
                <div className="bg-white p-5 rounded-lg">
                  <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                    <GiModernCity className="mr-2 text-blue-500" />
                    Travel Details
                  </h3>
                  
                  <div className="space-y-4">
                    <FormControl fullWidth>
                      <InputLabel>From Location</InputLabel>
                      <Select
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        label="From Location"
                      >
                        {locations.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>To Location</InputLabel>
                      <Select
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        label="To Location"
                      >
                        {locations.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Date
                      </label>
                      <Button
                        onClick={(e) => setLeaveAnchorEl(e.currentTarget)}
                        className="w-full text-left border p-3 rounded-lg flex items-center"
                        startIcon={<IoCalendarClearOutline />}
                      >
                        {leaveDate ? leaveDate.toLocaleDateString() : "Select date"}
                      </Button>
                      <Popover
                        open={Boolean(leaveAnchorEl)}
                        anchorEl={leaveAnchorEl}
                        onClose={() => setLeaveAnchorEl(null)}
                      >
                        <DayPicker
                          mode="single"
                          selected={leaveDate}
                          onSelect={(date) => {
                            setLeaveDate(date);
                            setLeaveAnchorEl(null);
                          }}
                          disabled={{ before: new Date() }}
                          className="border-0"
                        />
                      </Popover>
                    </div>

                    <FormControl fullWidth>
                      <InputLabel>Number of Guests</InputLabel>
                      <Select
                        value={numGuests}
                        onChange={(e) => setNumGuests(e.target.value)}
                        label="Number of Guests"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <MenuItem key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Hotel Selection */}
              {toLocation && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-1 rounded-lg">
                  <div className="bg-white p-5 rounded-lg">
                    <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                      <MdHotel className="mr-2 text-green-500" />
                      Accommodation
                    </h3>
                    
                    <FormControl fullWidth className="mb-4">
                      <InputLabel>Select Hotel</InputLabel>
                      <Select
                        value={selectedHotel?._id || ''}
                        onChange={(e) => {
                          const hotel = hotels.find(h => h._id === e.target.value);
                          setSelectedHotel(hotel);
                        }}
                        label="Select Hotel"
                      >
                        {hotels
                          .filter(h => h.location === toLocation)
                          .map(hotel => (
                            <MenuItem key={hotel._id} value={hotel._id}>
                              <div className="flex items-center gap-3">
                                <img 
                                  src={hotel.image} 
                                  alt={hotel.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium">{hotel.name}</p>
                                  <p className="text-sm text-gray-500">${hotel.price}/night</p>
                                </div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    {selectedHotel && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={selectedHotel.image}
                            className="w-16 h-16 rounded-lg object-cover"
                            alt={selectedHotel.name}
                          />
                          <div>
                            <h3 className="font-bold">{selectedHotel.name}</h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <PiStarFill 
                                  key={i} 
                                  className={`${i < selectedHotel.rating ? 'text-yellow-400' : 'text-gray-300'} text-lg`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <FormControl fullWidth>
                          <InputLabel>Number of Rooms</InputLabel>
                          <Select
                            value={numRooms}
                            onChange={(e) => setNumRooms(e.target.value)}
                            label="Number of Rooms"
                          >
                            {[1, 2, 3, 4].map(num => (
                              <MenuItem key={num} value={num}>{num} {num === 1 ? 'room' : 'rooms'}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Transport and Rental Section */}
            <div className="space-y-6">
              {/* Transport Options */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-1 rounded-lg">
                <div className="bg-white p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center text-lg font-semibold text-gray-700">
                      <MdDirectionsBus className="mr-2 text-purple-500" />
                      Transportation
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={needTransport}
                        onChange={() => setNeedTransport(!needTransport)}
                      />
                      <span className="text-sm">Add Transport</span>
                    </label>
                  </div>

                  {needTransport && (
                    <div className="space-y-4">
                      <FormControl fullWidth>
                        <InputLabel>Transport Type</InputLabel>
                        <Select
                          value={serviceChoose}
                          onChange={(e) => setService(e.target.value)}
                          label="Transport Type"
                        >
                          <MenuItem value={1}>
                            <div className="flex items-center">
                              <FaBus className="mr-2 text-blue-500" />
                              Bus
                            </div>
                          </MenuItem>
                          <MenuItem value={2}>
                            <div className="flex items-center">
                              <FaPlane className="mr-2 text-blue-500" />
                              Plane
                            </div>
                          </MenuItem>
                          <MenuItem value={3}>
                            <div className="flex items-center">
                              <FaTrain className="mr-2 text-blue-500" />
                              Train
                            </div>
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Class</InputLabel>
                        <Select
                          value={classValue}
                          onChange={(e) => setClass(e.target.value)}
                          label="Class"
                        >
                          <MenuItem value={4}>Business Class</MenuItem>
                          <MenuItem value={5}>First Class</MenuItem>
                          <MenuItem value={6}>Economy Class</MenuItem>
                        </Select>
                      </FormControl>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-center font-bold text-2xl text-blue-600">
                          ${totalTransportPrice}
                        </p>
                        <p className="text-center text-sm text-gray-500 mt-1">
                          {transportPricePerNight} × {numGuests} guests
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rental Options */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-1 rounded-lg">
                <div className="bg-white p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center text-lg font-semibold text-gray-700">
                      <MdDirectionsCar className="mr-2 text-orange-500" />
                      Vehicle Rental
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={needRental}
                        onChange={() => setNeedRental(!needRental)}
                      />
                      <span className="text-sm">Add Rental</span>
                    </label>
                  </div>

                  {needRental && (
                    <div className="space-y-4">
                      <FormControl fullWidth>
                        <InputLabel>Vehicle Type</InputLabel>
                        <Select
                          value={rental}
                          onChange={(e) => setRental(e.target.value)}
                          label="Vehicle Type"
                        >
                          {Object.entries(seatMap).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              <div className="flex items-center">
                                {value.icon}
                                {value.name} ({value.seats})
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <p className="text-center font-bold text-2xl text-orange-600">
                          ${rentalNumeric}
                        </p>
                        <p className="text-center text-sm text-gray-500 mt-1">
                          {seatMap[rental]?.seats || 'Select vehicle'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl border border-indigo-200 shadow-sm">
            <h3 className="text-xl font-bold text-center mb-6 text-indigo-800">
              Tour Summary
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Hotel Summary */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MdHotel className="mr-2 text-green-500" />
                  Accommodation
                </h4>
                {selectedHotel ? (
                  <>
                    <p className="text-gray-600">{selectedHotel.name}</p>
                    <p className="text-gray-600">
                      {numRooms} {numRooms === 1 ? 'room' : 'rooms'} × {numGuests} {numGuests === 1 ? 'person' : 'people'}
                    </p>
                    <p className="font-bold text-lg mt-2">
                      ${hotelPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400">No hotel selected</p>
                )}
              </div>

              {/* Transport Summary */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MdDirectionsBus className="mr-2 text-purple-500" />
                  Transportation
                </h4>
                {needTransport ? (
                  <>
                    <p className="text-gray-600">
                      {["Bus", "Plane", "Train"][serviceChoose - 1]} - 
                      {["", "", "", "Business", "First Class", "Economy"][classValue]}
                    </p>
                    <p className="font-bold text-lg mt-2">
                      ${totalTransportPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400">Not included</p>
                )}
              </div>

              {/* Rental Summary */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MdDirectionsCar className="mr-2 text-orange-500" />
                  Vehicle Rental
                </h4>
                {needRental ? (
                  <>
                    <p className="text-gray-600">{seatMap[rental]?.name || 'Not selected'}</p>
                    <p className="font-bold text-lg mt-2">
                      ${rentalNumeric}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400">Not included</p>
                )}
              </div>
            </div>

            {/* Total and Actions */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-800">Total Cost</h4>
                <p className="text-2xl font-bold text-blue-600">${totalPrice}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReset}
                  className="btn btn-outline flex-1 py-3 text-lg"
                >
                  Reset All
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary flex-1 py-3 text-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomTour;