"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, User, LogOut, Stethoscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import api from "../../lib/api";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

import { Doctor, Appointment, AppointmentStatus } from "../../types";

// Define DoctorsResponse type
type DoctorsResponse = {
  data: Doctor[];
  totalPages: number;
};

const PatientDashboard = () => {
  const { user, setUser, setToken } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Dashboard states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("All");
  const [page, setPage] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, selectedSpecialization]);

  const {
    data: doctorsResponse,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
  } = useQuery<DoctorsResponse>({
    queryKey: ["doctors", debouncedSearchTerm, selectedSpecialization, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: "9" });
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (selectedSpecialization && selectedSpecialization !== "All") {
        params.append("specialization", selectedSpecialization);
      }
      const response = await api.get(`/doctors`, { params });
      return response.data;
    },
  });

  const doctors = doctorsResponse?.data;
  const totalPages = doctorsResponse?.totalPages || 0;

  const {
    data: specializationsData,
    isLoading: isLoadingSpecializations,
    isError: isErrorSpecializations,
  } = useQuery<string[]>({
    queryKey: ["specializations"],
    queryFn: async () => {
      const response = await api.get("/specializations");
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    },
  });

  const specializations = ["All", ...(specializationsData || [])];

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate) return;

    setIsBooking(true);
    const toastId = toast.loading("Booking appointment...");

    try {
      const payload = { doctorId: selectedDoctor.id, date: selectedDate };
      await api.post("/appointments", payload);

      toast.success("Appointment booked successfully!", { id: toastId });
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedDate("");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Could not book appointment.";
      toast.error(`Booking failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsBooking(false);
    }
  };

  const logout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully.", { id: toastId });
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed.", { id: toastId });
    } finally {
      setUser(null);
      setToken(null);
      router.push("/login");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Find a Doctor
        </h2>
        <p className="text-gray-600">
          Book appointments with qualified healthcare professionals
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              disabled={isLoadingSpecializations}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
            >
              {isErrorSpecializations ? (
                <option>Error loading specializations</option>
              ) : (
                specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === "All" ? "All Specializations" : spec}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {isLoadingDoctors && <LoadingSpinner />}
      {isErrorDoctors && (
        <p className="text-center text-red-500">Error fetching doctors.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLoadingDoctors &&
          !isErrorDoctors &&
          (doctors || []).map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  {doctor.photo_url ? (
                    <img
                      src={doctor.photo_url}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowBookingModal(true);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          ))}
      </div>

      {!isLoadingDoctors && !isErrorDoctors && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {!isLoadingDoctors && !isErrorDoctors && doctors?.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No doctors found matching your criteria.</p>
        </div>
      )}

      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Book Appointment
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Doctor</p>
              <p className="font-medium">{selectedDoctor.name}</p>
              <p className="text-sm text-gray-600">
                {selectedDoctor.specialization}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedDoctor(null);
                  setSelectedDate("");
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || isBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? "Booking..." : "Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDashboard;
