"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Stethoscope, Search } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { getPatientAppointments, updateAppointmentStatus } from "../../lib/apiService";
import { Appointment } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

interface AppointmentsResponse {
  data: Appointment[];
  totalPages: number;
}

const PatientAppointments: React.FC = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [appointmentFilter, setAppointmentFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { data: appointmentsResponse, isLoading } = useQuery<AppointmentsResponse>({
    queryKey: ["patient-appointments", appointmentFilter, page],
    queryFn: () => getPatientAppointments({ 
      page, 
      limit: 5, 
      status: appointmentFilter === 'All' ? undefined : appointmentFilter 
    }),
    enabled: !!user,
  });

  const appointments = appointmentsResponse?.data || [];
  const totalPages = appointmentsResponse?.totalPages || 0;

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => 
      updateAppointmentStatus({ appointment_id: appointmentId, status: "CANCELLED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Appointment cancelled successfully.");
    },
    onError: () => toast.error("Failed to cancel appointment."),
  });

  const handleCancelAppointment = (appointmentId: string) => {
    cancelMutation.mutate(appointmentId);
  };

  const getStatusBadgeClasses = (status: any) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatusText = (status: any) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (!user) return <LoadingSpinner />;

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-8">
        <select
          value={appointmentFilter}
          onChange={(e) => { setAppointmentFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg border border-gray-300 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.doctor?.name}</h3>
                    <p className="text-sm text-gray-700">{appointment.doctor?.specialization}</p>
                    <p className="text-sm text-gray-700 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(appointment.status)}`}>
                    {formatStatusText(appointment.status)}
                  </span>
                  {appointment.status === "PENDING" && (
                    <button onClick={() => handleCancelAppointment(appointment.id)} disabled={cancelMutation.isPending} className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500">
                {appointmentFilter !== "All"
                  ? "Try adjusting your filter"
                  : "You have no scheduled appointments"}
              </p>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default PatientAppointments;
