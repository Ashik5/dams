import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  User,
  CheckCircle,
  Heart,
  Eye,
  Brain,
  Bone,
  Baby,
  Smile,
  Activity,
} from "lucide-react";

interface SpecializationCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
}

const SpecializationCard: React.FC<SpecializationCardProps> = ({
  icon,
  title,
  color,
}) => (
  <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
    <div
      className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-4`}
    >
      {icon}
    </div>
    <h3 className="font-medium text-gray-900">{title}</h3>
  </div>
);

interface FeatureListItemProps {
  children: React.ReactNode;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ children }) => (
  <li className="flex items-center">
    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  features: string[];
  iconBg: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  features,
  iconBg,
}) => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <div
      className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-6`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <ul className="space-y-3 text-gray-600">
      {features.map((feature, index) => (
        <FeatureListItem key={index}>{feature}</FeatureListItem>
      ))}
    </ul>
  </div>
);

const LandingPage: React.FC = () => {
  const specializations = [
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Cardiologist",
      color: "bg-red-100",
    },
    {
      icon: <Smile className="w-6 h-6 text-blue-600" />,
      title: "Dentist",
      color: "bg-blue-100",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "Neurologist",
      color: "bg-purple-100",
    },
    {
      icon: <Eye className="w-6 h-6 text-yellow-600" />,
      title: "Ophthalmologist",
      color: "bg-yellow-100",
    },
    {
      icon: <Activity className="w-6 h-6 text-green-600" />,
      title: "Dermatologist",
      color: "bg-green-100",
    },
    {
      icon: <Bone className="w-6 h-6 text-indigo-600" />,
      title: "Orthopedist",
      color: "bg-indigo-100",
    },
    {
      icon: <Baby className="w-6 h-6 text-pink-600" />,
      title: "Pediatrician",
      color: "bg-pink-100",
    },
    {
      icon: <Brain className="w-6 h-6 text-orange-600" />,
      title: "Psychiatrist",
      color: "bg-orange-100",
    },
  ];

  const patientFeatures = [
    "Browse doctors by specialization",
    "Real-time appointment booking",
    "Track appointment status",
    "Manage your appointments",
  ];

  const doctorFeatures = [
    "Comprehensive appointment dashboard",
    "Filter by date and status",
    "Update appointment status",
    "Patient management tools",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MedCare</h1>
            </Link>
            <div className="flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Streamline Your Healthcare Appointments
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Modern appointment management system connecting patients with
            healthcare providers. Book appointments, manage schedules, and track
            your healthcare journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Book an Appointment
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools for patients and healthcare providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <FeatureCard
              icon={<User className="w-6 h-6 text-blue-600" />}
              title="For Patients"
              features={patientFeatures}
              iconBg="bg-blue-100"
            />
            <FeatureCard
              icon={<Stethoscope className="w-6 h-6 text-green-600" />}
              title="For Doctors"
              features={doctorFeatures}
              iconBg="bg-green-100"
            />
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Medical Specializations
            </h2>
            <p className="text-lg text-gray-600">
              Find healthcare providers across various medical specialties
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specializations.map((specialization, index) => (
              <SpecializationCard
                key={index}
                icon={specialization.icon}
                title={specialization.title}
                color={specialization.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of patients and healthcare providers using MedCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=patient"
              className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Start as Patient
            </Link>
            <Link
              href="/register?role=doctor"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                MedCare
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 MedCare. Streamlining healthcare appointments.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
