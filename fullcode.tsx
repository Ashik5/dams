"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  LogOut,
  Stethoscope,
  Users,
  CalendarDays,
  Eye,
  EyeOff,
} from "lucide-react";

// Type definitions
interface User {
  id?: number;
  name: string;
  email?: string;
  role: UserRole;
  specialization?: string;
  photo_url?: string;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  photo_url?: string;
}

interface Appointment {
  id: number;
  doctorId?: number;
  doctorName: string;
  patientId?: number;
  patientName?: string;
  date: string;
  status: AppointmentStatus;
  specialization: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  specialization: string;
  photo_url: string;
}

// Enums and Types
type UserRole = "PATIENT" | "DOCTOR";
type AppointmentStatus = "PENDING" | "COMPLETED" | "CANCELLED";
type ViewType =
  | "login"
  | "register"
  | "patient-dashboard"
  | "patient-appointments"
  | "doctor-dashboard";

// Mock data with proper typing
const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@example.com",
    specialization: "Cardiologist",
    photo_url: undefined,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    specialization: "Dentist",
    photo_url: undefined,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    specialization: "Neurologist",
    photo_url: undefined,
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    email: "james.thompson@example.com",
    specialization: "Orthopedic",
    photo_url: undefined,
  },
  {
    id: 5,
    name: "Dr. Lisa Kumar",
    email: "lisa.kumar@example.com",
    specialization: "Dermatologist",
    photo_url: undefined,
  },
  {
    id: 6,
    name: "Dr. Robert Taylor",
    email: "robert.taylor@example.com",
    specialization: "Pediatrician",
    photo_url: undefined,
  },
];

const mockAppointments: Appointment[] = [
  {
    id: 1,
    doctorId: 1,
    doctorName: "Dr. Sarah Wilson",
    patientName: "John Doe",
    date: "2025-09-10",
    status: "PENDING",
    specialization: "Cardiologist",
  },
  {
    id: 2,
    doctorId: 2,
    doctorName: "Dr. Michael Chen",
    patientName: "Jane Smith",
    date: "2025-09-08",
    status: "COMPLETED",
    specialization: "Dentist",
  },
  {
    id: 3,
    doctorId: 3,
    doctorName: "Dr. Emily Rodriguez",
    patientName: "Bob Johnson",
    date: "2025-09-15",
    status: "CANCELLED",
    specialization: "Neurologist",
  },
];

const specializations: string[] = [
  "All",
  "Cardiologist",
  "Dentist",
  "Neurologist",
  "Orthopedic",
  "Dermatologist",
  "Pediatrician",
];

const DoctorAppointmentSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("login");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("PATIENT");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form states with proper typing
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    specialization: "",
    photo_url: "",
  });

  // Dashboard states with proper typing
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("All");
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [appointmentFilter, setAppointmentFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Filter doctors based on search and specialization
  const filteredDoctors: Doctor[] = mockDoctors.filter((doctor: Doctor) => {
    const matchesSearch: boolean = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialization: boolean =
      selectedSpecialization === "All" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  // Filter appointments
  const filteredAppointments: Appointment[] = appointments.filter(
    (appointment: Appointment) => {
      const matchesStatus: boolean =
        appointmentFilter === "All" || appointment.status === appointmentFilter;
      const matchesDate: boolean =
        !dateFilter || appointment.date === dateFilter;
      return matchesStatus && matchesDate;
    }
  );

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Mock login - in real app, this would make API call
    const newUser: User = {
      name: selectedRole === "PATIENT" ? "John Doe" : "Dr. Jane Smith",
      role: selectedRole,
      email: loginForm.email,
    };
    setUser(newUser);
    setUserRole(selectedRole);
    setCurrentView(
      selectedRole === "PATIENT" ? "patient-dashboard" : "doctor-dashboard"
    );
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Mock registration - in real app, this would make API call
    const newUser: User = {
      name: registerForm.name,
      role: selectedRole,
      email: registerForm.email,
      specialization:
        selectedRole === "DOCTOR" ? registerForm.specialization : undefined,
    };
    setUser(newUser);
    setUserRole(selectedRole);
    setCurrentView(
      selectedRole === "PATIENT" ? "patient-dashboard" : "doctor-dashboard"
    );
  };

  const handleBookAppointment = (): void => {
    if (selectedDoctor && selectedDate) {
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        patientName: user?.name || "Unknown Patient",
        date: selectedDate,
        status: "PENDING",
        specialization: selectedDoctor.specialization,
      };
      setAppointments([...appointments, newAppointment]);
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedDate("");
    }
  };

  const updateAppointmentStatus = (
    appointmentId: number,
    newStatus: AppointmentStatus
  ): void => {
    setAppointments(
      appointments.map((app: Appointment) =>
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  const logout = (): void => {
    setUser(null);
    setUserRole(null);
    setCurrentView("login");
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      name: "",
      email: "",
      password: "",
      specialization: "",
      photo_url: "",
    });
  };

  const getStatusBadgeClasses = (status: AppointmentStatus): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatusText = (status: AppointmentStatus): string => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Login Page Component
  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("PATIENT")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === "PATIENT"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("DOCTOR")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === "DOCTOR"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Stethoscope className="w-4 h-4 mx-auto mb-1" />
                Doctor
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setCurrentView("register")}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Register Page Component
  if (currentView === "register") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create account
            </h1>
            <p className="text-gray-600 mt-2">Join our healthcare platform</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("PATIENT")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === "PATIENT"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("DOCTOR")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === "DOCTOR"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Stethoscope className="w-4 h-4 mx-auto mb-1" />
                Doctor
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={registerForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {selectedRole === "DOCTOR" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  required
                  value={registerForm.specialization}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRegisterForm({
                      ...registerForm,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select specialization</option>
                  {specializations.slice(1).map((spec: string) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo URL (Optional)
              </label>
              <input
                type="url"
                value={registerForm.photo_url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegisterForm({
                    ...registerForm,
                    photo_url: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
            >
              Create account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentView("login")}
                className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Patient Dashboard Component
  if (currentView === "patient-dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  HealthCare
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView("patient-appointments")}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  My Appointments
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Find a Doctor
            </h2>
            <p className="text-gray-600">
              Book appointments with qualified healthcare professionals
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedSpecialization}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedSpecialization(e.target.value)
                  }
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
                >
                  {specializations.map((spec: string) => (
                    <option key={spec} value={spec}>
                      {spec === "All" ? "All Specializations" : spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor: Doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
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
                    <h3 className="font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedDate(e.target.value)
                  }
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
                  disabled={!selectedDate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Patient Appointments Page Component
  if (currentView === "patient-appointments") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentView("patient-dashboard")}
                  className="text-gray-600 hover:text-gray-900 mr-4"
                >
                  ←
                </button>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Appointments
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={appointmentFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAppointmentFilter(e.target.value)
                }
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment: Appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.specialization}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {appointment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                        appointment.status
                      )}`}
                    >
                      {formatStatusText(appointment.status)}
                    </span>
                    {appointment.status === "PENDING" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "CANCELLED")
                        }
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {appointmentFilter !== "All"
                    ? "Try changing the filter"
                    : "Book your first appointment to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Doctor Dashboard Component
  if (currentView === "doctor-dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Doctor Portal
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Appointment Management
            </h2>
            <p className="text-gray-600">Manage your patient appointments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      appointments.filter(
                        (a: Appointment) => a.status === "PENDING"
                      ).length
                    }
                  </h3>
                  <p className="text-sm text-gray-600">Pending Appointments</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      appointments.filter(
                        (a: Appointment) => a.status === "COMPLETED"
                      ).length
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    Completed Appointments
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      appointments.filter(
                        (a: Appointment) => a.status === "CANCELLED"
                      ).length
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cancelled Appointments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={appointmentFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAppointmentFilter(e.target.value)
                }
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDateFilter(e.target.value)
                }
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Filter by date"
              />
              {(appointmentFilter !== "All" || dateFilter) && (
                <button
                  onClick={() => {
                    setAppointmentFilter("All");
                    setDateFilter("");
                  }}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment: Appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientName || "Unknown Patient"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Appointment with {appointment.doctorName}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {appointment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                        appointment.status
                      )}`}
                    >
                      {formatStatusText(appointment.status)}
                    </span>
                    {appointment.status === "PENDING" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "COMPLETED")
                          }
                          className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "CANCELLED")
                          }
                          className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {appointmentFilter !== "All" || dateFilter
                    ? "Try adjusting your filters"
                    : "Appointments will appear here when patients book with you"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DoctorAppointmentSystem;
