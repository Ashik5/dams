"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Search,
  X,
} from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../lib/apiService";
import { Appointment, AppointmentStatus } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../lib/api";

interface AppointmentsResponse {
  data: Appointment[];
  totalPages: number;
}

type SortField = "date" | "patientName" | "status";
type SortOrder = "asc" | "desc";

interface ConfirmationDialog {
  isOpen: boolean;
  type: "complete" | "cancel" | "bulk_complete" | "bulk_cancel" | null;
  appointmentId: string | null;
  selectedIds?: string[];
}

const DoctorDashboard: React.FC = () => {
  const { user, setUser, setToken } = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [appointmentFilter, setAppointmentFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(
    new Set()
  );
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    isOpen: false,
    type: null,
    appointmentId: null,
  });

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appointmentFilter, dateFilter, searchQuery]);

  const { data: appointmentsResponse, isLoading: isLoadingAppointments } =
    useQuery<AppointmentsResponse>({
      queryKey: [
        "doctor-appointments",
        appointmentFilter,
        dateFilter,
        searchQuery,
        currentPage,
      ],
      queryFn: () =>
        getDoctorAppointments({
          page: currentPage,
          limit: 10,
          status: appointmentFilter === "All" ? undefined : appointmentFilter,
          date: dateFilter || undefined,
          search: searchQuery || undefined,
        }),
      enabled: !!user,
    });

  const appointments = appointmentsResponse?.data || [];
  const totalPages = appointmentsResponse?.totalPages || 0;

  const updateAppointmentMutation = useMutation({
    mutationFn: (variables: {
      appointmentId: string;
      status: AppointmentStatus;
    }) =>
      updateAppointmentStatus({
        appointment_id: variables.appointmentId,
        status: variables.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Appointment status updated successfully.");
      setConfirmDialog({ isOpen: false, type: null, appointmentId: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status.");
    },
  });

  const bulkUpdateAppointmentsMutation = useMutation({
    mutationFn: async (variables: {
      appointmentIds: string[];
      status: AppointmentStatus;
    }) => {
      const promises = variables.appointmentIds.map((id) =>
        updateAppointmentStatus({
          appointment_id: id,
          status: variables.status,
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Appointments updated successfully.");
      setSelectedAppointments(new Set());
      setConfirmDialog({ isOpen: false, type: null, appointmentId: null });
    },
    onError: (error: any) => {
      toast.error("Failed to update some appointments.");
    },
  });

  const sortedAppointments = [...appointments].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case "patientName":
        aValue = a.patient?.name || "";
        bValue = b.patient?.name || "";
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleConfirmAction = () => {
    if (
      confirmDialog.type === "bulk_complete" ||
      confirmDialog.type === "bulk_cancel"
    ) {
      const newStatus =
        confirmDialog.type === "bulk_complete" ? "COMPLETED" : "CANCELLED";
      bulkUpdateAppointmentsMutation.mutate({
        appointmentIds: Array.from(selectedAppointments),
        status: newStatus,
      });
    } else if (confirmDialog.appointmentId && confirmDialog.type) {
      const newStatus =
        confirmDialog.type === "complete" ? "COMPLETED" : "CANCELLED";
      updateAppointmentMutation.mutate({
        appointmentId: confirmDialog.appointmentId,
        status: newStatus,
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allAppointmentIds = sortedAppointments.map((apt) => apt.id);
      setSelectedAppointments(new Set(allAppointmentIds));
    } else {
      setSelectedAppointments(new Set());
    }
  };

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    const newSelected = new Set(selectedAppointments);
    if (checked) {
      newSelected.add(appointmentId);
    } else {
      newSelected.delete(appointmentId);
    }
    setSelectedAppointments(newSelected);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const logout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      setUser(null);
      setToken(null);
      toast.success("Logged out successfully.", { id: toastId });
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed.", { id: toastId });
    } finally {
      router.push("/login");
    }
  };

  const getStatusBadgeClasses = (status: AppointmentStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const allAppointmentIds = sortedAppointments.map((apt) => apt.id);
  const allSelected = allAppointmentIds.length > 0 && allAppointmentIds.every((id) => selectedAppointments.has(id));
  const someSelected = selectedAppointments.size > 0 && !allSelected;

  if (!user) return <LoadingSpinner />;

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">MedCare</h1>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4">{/* Nav links */}</nav>
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center`}>
              <div
                className={`${
                  sidebarCollapsed ? "w-10 h-10" : "w-8 h-8"
                } bg-green-100 rounded-full flex items-center justify-center`}
              >
                <User
                  className={`${
                    sidebarCollapsed ? "w-6 h-6" : "w-4 h-4"
                  } text-green-600`}
                />
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.specialization}
                  </p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Appointments
            </h1>
          </div>

          {/* Filters and Search */}
          <div className="bg-white px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={appointmentFilter}
                onChange={(e) => setAppointmentFilter(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAppointments.size > 0 && (
            <div className="bg-green-50 border-b border-green-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-green-800">
                    {selectedAppointments.size} appointment
                    {selectedAppointments.size !== 1 ? "s" : ""} selected
                  </span>
                  <button
                    onClick={() => setSelectedAppointments(new Set())}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        type: "bulk_complete",
                        appointmentId: null,
                        selectedIds: Array.from(selectedAppointments),
                      })
                    }
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Selected
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        type: "bulk_cancel",
                        appointmentId: null,
                        selectedIds: Array.from(selectedAppointments),
                      })
                    }
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto bg-white">
            {isLoadingAppointments ? (
              <LoadingSpinner />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={sortedAppointments.length === 0}
                        ref={(input) => {
                          if (input)
                            input.indeterminate = someSelected;
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className={
                        selectedAppointments.has(appointment.id)
                          ? "bg-green-50"
                          : ""
                      }
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.has(appointment.id)}
                          onChange={(e) =>
                            handleSelectAppointment(
                              appointment.id,
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient?.name || "N/A"}
                        </div>
                        {appointment.patient?.email && (
                          <div className="text-sm text-gray-500">
                            {appointment.patient.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {appointment.status === "PENDING" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  type: "complete",
                                  appointmentId: appointment.id,
                                })
                              }
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="Complete appointment"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  type: "cancel",
                                  appointmentId: appointment.id,
                                })
                              }
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Cancel appointment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!isLoadingAppointments && sortedAppointments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-500">
                  {searchQuery || dateFilter || appointmentFilter !== "All"
                    ? "Try adjusting your search or filters"
                    : "No appointments scheduled"}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="bg-white border-t border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Action
              </h3>
              <p className="text-gray-700 mb-6">
                {confirmDialog.type?.startsWith("bulk_") ? (
                  <>
                    Are you sure you want to{" "}
                    {confirmDialog.type === "bulk_complete"
                      ? "complete"
                      : "cancel"}{" "}
                    {selectedAppointments.size} selected appointment
                    {selectedAppointments.size !== 1 ? "s" : ""}?
                  </>
                ) : (
                  <>
                    Are you sure you want to {confirmDialog.type} this
                    appointment?
                  </>
                )}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: false,
                      type: null,
                      appointmentId: null,
                    })
                  }
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={
                    updateAppointmentMutation.isPending ||
                    bulkUpdateAppointmentsMutation.isPending
                  }
                  className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    confirmDialog.type === "complete" ||
                    confirmDialog.type === "bulk_complete"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50`}
                >
                  {updateAppointmentMutation.isPending ||
                  bulkUpdateAppointmentsMutation.isPending
                    ? "Processing..."
                    : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorDashboard;
