import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Trash2,
  Plus,
  Search,
  Users,
  MapPin,
  Loader2,
  Pencil,
  Trash,
} from 'lucide-react';

type Complaint = {
  id: string;
  complaint_number: string;
  area: string;
  locality: string | null;
  address: string;
  description: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  assigned_driver_id: string | null;
};

type Driver = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  vehicle_number: string | null;
  license_number: string | null;
  status: string | null;
  user_id: string | null;
};

type Bin = {
  id: string;
  location: string;
  area: string;
  locality: string | null;
  capacity: string | null;
  status: string | null;
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Driver Form
  const [newDriver, setNewDriver] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    license_number: '',
    vehicle_number: '',
  });
  const [addingDriver, setAddingDriver] = useState(false);
  const [driverErrors, setDriverErrors] = useState<Record<string, string>>({});
  
  // Edit Driver
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editDriverData, setEditDriverData] = useState({
    full_name: '',
    phone: '',
    email: '',
    license_number: '',
    vehicle_number: '',
    status: 'active',
  });
  const [updatingDriver, setUpdatingDriver] = useState(false);
  const [deletingDriverId, setDeletingDriverId] = useState<string | null>(null);
  
  // Add Bin Form
  const [newBin, setNewBin] = useState({
    location: '',
    area: '',
    locality: '',
    capacity: 'medium',
  });
  const [addingBin, setAddingBin] = useState(false);
  
  // Assign Dialog
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignData, setAssignData] = useState<{
    driver_id: string;
    remarks: string;
    status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  }>({
    driver_id: '',
    remarks: '',
    status: 'assigned',
  });
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (userRole !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, userRole, authLoading, navigate, toast]);

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchData();
    }
  }, [user, userRole]);

  const fetchData = async () => {
    setLoading(true);
    
    const [complaintsRes, driversRes, binsRes] = await Promise.all([
      supabase.from('complaints').select('*').order('created_at', { ascending: false }),
      supabase.from('drivers').select('*').order('created_at', { ascending: false }),
      supabase.from('bins').select('*').order('created_at', { ascending: false }),
    ]);
    
    if (complaintsRes.data) setComplaints(complaintsRes.data as Complaint[]);
    if (driversRes.data) setDrivers(driversRes.data as Driver[]);
    if (binsRes.data) setBins(binsRes.data as Bin[]);
    
    setLoading(false);
  };

  // Validation functions
  const validatePhone = (phone: string): string | null => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Must be 10 digits starting with 6, 7, 8, or 9';
    return null;
  };

  const validateVehicleNumber = (vehicleNum: string): string | null => {
    if (!vehicleNum) return null; // Optional field
    // Format: 2 letters (state) + 2 digits (RTO) + optional letters + 4 digits
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{0,3}[0-9]{4}$/i;
    if (!vehicleRegex.test(vehicleNum.replace(/\s|-/g, ''))) {
      return 'Invalid format (e.g., KA01AB1234)';
    }
    return null;
  };

  const validateLicenseNumber = (license: string): string | null => {
    if (!license) return null; // Optional field
    // 16 characters alphanumeric with possible spaces/hyphens
    const cleanLicense = license.replace(/[\s-]/g, '');
    if (cleanLicense.length < 15 || cleanLicense.length > 16) {
      return 'Must be 15-16 characters';
    }
    if (!/^[A-Z0-9]+$/i.test(cleanLicense)) {
      return 'Only letters and numbers allowed';
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleAddDriver = async () => {
    // Validate all fields
    const errors: Record<string, string> = {};
    
    if (!newDriver.full_name.trim()) errors.full_name = 'Name is required';
    
    const phoneError = validatePhone(newDriver.phone);
    if (phoneError) errors.phone = phoneError;
    
    const emailError = validateEmail(newDriver.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(newDriver.password);
    if (passwordError) errors.password = passwordError;
    
    const vehicleError = validateVehicleNumber(newDriver.vehicle_number);
    if (vehicleError) errors.vehicle_number = vehicleError;
    
    const licenseError = validateLicenseNumber(newDriver.license_number);
    if (licenseError) errors.license_number = licenseError;
    
    setDriverErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }
    
    setAddingDriver(true);
    
    // Create auth user for driver
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newDriver.email,
      password: newDriver.password,
      options: {
        data: {
          full_name: newDriver.full_name,
        },
      },
    });
    
    if (authError) {
      toast({
        title: 'Error Creating Account',
        description: authError.message,
        variant: 'destructive',
      });
      setAddingDriver(false);
      return;
    }
    
    // Insert driver record
    const { error } = await supabase.from('drivers').insert([{
      full_name: newDriver.full_name,
      phone: newDriver.phone,
      email: newDriver.email,
      license_number: newDriver.license_number || null,
      vehicle_number: newDriver.vehicle_number.toUpperCase().replace(/[\s-]/g, '') || null,
      user_id: authData.user?.id,
    }]);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      // Add driver role
      if (authData.user?.id) {
        await supabase.from('user_roles').insert([{
          user_id: authData.user.id,
          role: 'driver',
        }]);
      }
      
      toast({
        title: 'Driver Added',
        description: 'New driver has been added successfully. They will receive a confirmation email.',
      });
      setNewDriver({ full_name: '', phone: '', email: '', password: '', license_number: '', vehicle_number: '' });
      setDriverErrors({});
      fetchData();
    }
    
    setAddingDriver(false);
  };

  const handleAddBin = async () => {
    if (!newBin.location || !newBin.area) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in location and area.',
        variant: 'destructive',
      });
      return;
    }
    
    setAddingBin(true);
    
    const { error } = await supabase.from('bins').insert([newBin]);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Bin Added',
        description: 'New bin has been registered successfully.',
      });
      setNewBin({ location: '', area: '', locality: '', capacity: 'medium' });
      fetchData();
    }
    
    setAddingBin(false);
  };

  const handleAssignComplaint = async () => {
    if (!selectedComplaint || !assignData.driver_id) {
      toast({
        title: 'Missing Fields',
        description: 'Please select a driver.',
        variant: 'destructive',
      });
      return;
    }
    
    setAssigning(true);
    
    const { error } = await supabase
      .from('complaints')
      .update({
        assigned_driver_id: assignData.driver_id,
        status: assignData.status,
        admin_remarks: assignData.remarks,
        assigned_at: new Date().toISOString(),
      })
      .eq('id', selectedComplaint.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      // Send notification to driver
      try {
        await supabase.functions.invoke('notify-driver', {
          body: {
            driver_id: assignData.driver_id,
            complaint_id: selectedComplaint.id,
            complaint_number: selectedComplaint.complaint_number,
            area: selectedComplaint.area,
            address: selectedComplaint.address,
          },
        });
      } catch (notifyError) {
        console.error('Failed to notify driver:', notifyError);
      }
      
      toast({
        title: 'Complaint Updated',
        description: 'Complaint has been assigned and driver notified.',
      });
      setSelectedComplaint(null);
      setAssignData({ driver_id: '', remarks: '', status: 'assigned' });
      fetchData();
    }
    
    setAssigning(false);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setEditDriverData({
      full_name: driver.full_name,
      phone: driver.phone,
      email: driver.email || '',
      license_number: driver.license_number || '',
      vehicle_number: driver.vehicle_number || '',
      status: driver.status || 'active',
    });
    setDriverErrors({});
  };

  const handleUpdateDriver = async () => {
    if (!editingDriver) return;
    
    // Validate fields
    const errors: Record<string, string> = {};
    
    if (!editDriverData.full_name.trim()) errors.full_name = 'Name is required';
    
    const phoneError = validatePhone(editDriverData.phone);
    if (phoneError) errors.phone = phoneError;
    
    const vehicleError = validateVehicleNumber(editDriverData.vehicle_number);
    if (vehicleError) errors.vehicle_number = vehicleError;
    
    const licenseError = validateLicenseNumber(editDriverData.license_number);
    if (licenseError) errors.license_number = licenseError;
    
    setDriverErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }
    
    setUpdatingDriver(true);
    
    const { error } = await supabase
      .from('drivers')
      .update({
        full_name: editDriverData.full_name,
        phone: editDriverData.phone,
        email: editDriverData.email || null,
        license_number: editDriverData.license_number || null,
        vehicle_number: editDriverData.vehicle_number.toUpperCase().replace(/[\s-]/g, '') || null,
        status: editDriverData.status,
      })
      .eq('id', editingDriver.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Driver Updated',
        description: 'Driver information has been updated.',
      });
      setEditingDriver(null);
      fetchData();
    }
    
    setUpdatingDriver(false);
  };

  const handleDeleteDriver = async (driverId: string) => {
    setDeletingDriverId(driverId);
    
    // Get driver to find user_id
    const driver = drivers.find(d => d.id === driverId);
    
    // Delete driver record
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driverId);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      // Also delete user role if exists
      if (driver?.user_id) {
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', driver.user_id);
      }
      
      toast({
        title: 'Driver Deleted',
        description: 'Driver has been removed from the system.',
      });
      fetchData();
    }
    
    setDeletingDriverId(null);
  };

  const getStats = () => {
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const assigned = complaints.filter((c) => c.status === 'assigned').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const completed = complaints.filter((c) => c.status === 'completed').length;
    const rejected = complaints.filter((c) => c.status === 'rejected').length;
    return { pending, assigned, inProgress, completed, rejected, total: complaints.length };
  };

  const stats = getStats();

  const filteredComplaints = complaints.filter(
    (c) =>
      c.complaint_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage complaints, drivers, and bins</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: BarChart3, color: 'bg-slate-100 text-slate-800' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'Assigned', value: stats.assigned, icon: Users, color: 'bg-blue-100 text-blue-800' },
            { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'bg-purple-100 text-purple-800' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-800' },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="bins">Bins</TabsTrigger>
          </TabsList>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>All Complaints</CardTitle>
                    <CardDescription>View and manage all submitted complaints</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by number or area..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredComplaints.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No complaints found</p>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium">{complaint.complaint_number}</span>
                              <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
                            </div>
                            <p className="text-sm text-foreground">{complaint.area} - {complaint.address}</p>
                            {complaint.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{complaint.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Complaint</DialogTitle>
                                <DialogDescription>
                                  {complaint.complaint_number} - {complaint.area}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Assign Driver</Label>
                                  <Select
                                    value={assignData.driver_id}
                                    onValueChange={(value) => setAssignData({ ...assignData, driver_id: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a driver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {drivers.map((driver) => (
                                        <SelectItem key={driver.id} value={driver.id}>
                                          {driver.full_name} {driver.email ? `(${driver.email})` : ''} - {driver.phone}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select
                                    value={assignData.status}
                                    onValueChange={(value) => setAssignData({ ...assignData, status: value as 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected' })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="assigned">Assigned</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Admin Remarks</Label>
                                  <Textarea
                                    placeholder="Add remarks..."
                                    value={assignData.remarks}
                                    onChange={(e) => setAssignData({ ...assignData, remarks: e.target.value })}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleAssignComplaint} disabled={assigning}>
                                  {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Update Complaint
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>All Drivers</CardTitle>
                  <CardDescription>Manage registered drivers and helpers</CardDescription>
                </CardHeader>
                <CardContent>
                  {drivers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No drivers registered</p>
                  ) : (
                    <div className="space-y-3">
                      {drivers.map((driver) => (
                        <div
                          key={driver.id}
                          className="flex items-center justify-between border border-border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{driver.full_name}</p>
                              {driver.email && <p className="text-sm text-muted-foreground">{driver.email}</p>}
                              <p className="text-sm text-muted-foreground">{driver.phone}</p>
                              {driver.vehicle_number && (
                                <p className="text-xs text-muted-foreground">Vehicle: {driver.vehicle_number}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                              {driver.status || 'active'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditDriver(driver)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteDriver(driver.id)}
                              disabled={deletingDriverId === driver.id}
                            >
                              {deletingDriverId === driver.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Driver
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="Driver name"
                      value={newDriver.full_name}
                      onChange={(e) => setNewDriver({ ...newDriver, full_name: e.target.value })}
                    />
                    {driverErrors.full_name && (
                      <p className="text-sm text-destructive">{driverErrors.full_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone * (10 digits, starts with 6-9)</Label>
                    <Input
                      placeholder="9876543210"
                      value={newDriver.phone}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setNewDriver({ ...newDriver, phone: value });
                      }}
                    />
                    {driverErrors.phone && (
                      <p className="text-sm text-destructive">{driverErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="driver@example.com"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    />
                    {driverErrors.email && (
                      <p className="text-sm text-destructive">{driverErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Password * (min 6 characters)</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newDriver.password}
                      onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                    />
                    {driverErrors.password && (
                      <p className="text-sm text-destructive">{driverErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>License Number (15-16 chars)</Label>
                    <Input
                      placeholder="KA0120210001234"
                      value={newDriver.license_number}
                      onChange={(e) => setNewDriver({ ...newDriver, license_number: e.target.value.toUpperCase() })}
                    />
                    {driverErrors.license_number && (
                      <p className="text-sm text-destructive">{driverErrors.license_number}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Number (e.g., KA01AB1234)</Label>
                    <Input
                      placeholder="KA01AB1234"
                      value={newDriver.vehicle_number}
                      onChange={(e) => setNewDriver({ ...newDriver, vehicle_number: e.target.value.toUpperCase() })}
                    />
                    {driverErrors.vehicle_number && (
                      <p className="text-sm text-destructive">{driverErrors.vehicle_number}</p>
                    )}
                  </div>
                  <Button onClick={handleAddDriver} className="w-full" disabled={addingDriver}>
                    {addingDriver && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Driver
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Edit Driver Dialog */}
            <Dialog open={!!editingDriver} onOpenChange={(open) => !open && setEditingDriver(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Driver</DialogTitle>
                  <DialogDescription>
                    Update driver information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="Driver name"
                      value={editDriverData.full_name}
                      onChange={(e) => setEditDriverData({ ...editDriverData, full_name: e.target.value })}
                    />
                    {driverErrors.full_name && (
                      <p className="text-sm text-destructive">{driverErrors.full_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone * (10 digits, starts with 6-9)</Label>
                    <Input
                      placeholder="9876543210"
                      value={editDriverData.phone}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setEditDriverData({ ...editDriverData, phone: value });
                      }}
                    />
                    {driverErrors.phone && (
                      <p className="text-sm text-destructive">{driverErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="driver@example.com"
                      value={editDriverData.email}
                      onChange={(e) => setEditDriverData({ ...editDriverData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>License Number (15-16 chars)</Label>
                    <Input
                      placeholder="KA0120210001234"
                      value={editDriverData.license_number}
                      onChange={(e) => setEditDriverData({ ...editDriverData, license_number: e.target.value.toUpperCase() })}
                    />
                    {driverErrors.license_number && (
                      <p className="text-sm text-destructive">{driverErrors.license_number}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Number (e.g., KA01AB1234)</Label>
                    <Input
                      placeholder="KA01AB1234"
                      value={editDriverData.vehicle_number}
                      onChange={(e) => setEditDriverData({ ...editDriverData, vehicle_number: e.target.value.toUpperCase() })}
                    />
                    {driverErrors.vehicle_number && (
                      <p className="text-sm text-destructive">{driverErrors.vehicle_number}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editDriverData.status}
                      onValueChange={(value) => setEditDriverData({ ...editDriverData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingDriver(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateDriver} disabled={updatingDriver}>
                    {updatingDriver && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Driver
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Bins Tab */}
          <TabsContent value="bins">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>All Bins</CardTitle>
                  <CardDescription>Manage garbage bins across locations</CardDescription>
                </CardHeader>
                <CardContent>
                  {bins.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No bins registered</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bins.map((bin) => (
                        <div
                          key={bin.id}
                          className="border border-border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                              <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{bin.area}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {bin.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{bin.capacity}</Badge>
                            <Badge variant={bin.status === 'active' ? 'default' : 'secondary'}>
                              {bin.status || 'active'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Bin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Specific location"
                      value={newBin.location}
                      onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Area</Label>
                    <Input
                      placeholder="Area name"
                      value={newBin.area}
                      onChange={(e) => setNewBin({ ...newBin, area: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Locality</Label>
                    <Input
                      placeholder="Locality"
                      value={newBin.locality}
                      onChange={(e) => setNewBin({ ...newBin, locality: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Select
                      value={newBin.capacity}
                      onValueChange={(value) => setNewBin({ ...newBin, capacity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddBin} className="w-full" disabled={addingBin}>
                    {addingBin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Bin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
