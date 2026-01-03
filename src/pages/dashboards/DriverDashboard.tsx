import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Truck,
  Clock,
  CheckCircle2,
  MapPin,
  Loader2,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';

type Complaint = {
  id: string;
  complaint_number: string;
  area: string;
  locality: string | null;
  landmark: string | null;
  address: string;
  description: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  admin_remarks: string | null;
  created_at: string;
  assigned_at: string | null;
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function DriverDashboard() {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [driverInfo, setDriverInfo] = useState<{ id: string; full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/driver/login');
      } else if (userRole !== 'driver') {
        toast({
          title: 'Access Denied',
          description: 'You do not have driver privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, userRole, authLoading, navigate, toast]);

  useEffect(() => {
    if (user && userRole === 'driver') {
      fetchDriverAndComplaints();
    }
  }, [user, userRole]);

  const fetchDriverAndComplaints = async () => {
    setLoading(true);
    
    // First get driver info
    const { data: driverData } = await supabase
      .from('drivers')
      .select('id, full_name')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (driverData) {
      setDriverInfo(driverData);
      
      // Then fetch complaints assigned to this driver
      const { data: complaintsData } = await supabase
        .from('complaints')
        .select('*')
        .eq('assigned_driver_id', driverData.id)
        .order('assigned_at', { ascending: false });
      
      if (complaintsData) setComplaints(complaintsData as Complaint[]);
    }
    
    setLoading(false);
  };

  const handleUpdateStatus = async (complaintId: string, newStatus: string) => {
    setUpdatingId(complaintId);
    
    const updateData: Record<string, unknown> = {
      status: newStatus,
    };
    
    if (newStatus === 'completed') {
      updateData.resolved_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', complaintId);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status Updated',
        description: `Complaint marked as ${newStatus.replace('_', ' ')}.`,
      });
      fetchDriverAndComplaints();
    }
    
    setUpdatingId(null);
  };

  const getStats = () => {
    const assigned = complaints.filter((c) => c.status === 'assigned').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const completed = complaints.filter((c) => c.status === 'completed').length;
    return { assigned, inProgress, completed, total: complaints.length };
  };

  const stats = getStats();

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-sky-100 text-sky-800 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Driver Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {driverInfo?.full_name || 'Driver'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.assigned}</p>
                  <p className="text-xs text-muted-foreground">New Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Complaints</CardTitle>
            <CardDescription>
              View and update the status of complaints assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No complaints assigned yet</p>
                <p className="text-sm text-muted-foreground">
                  Check back later for new assignments
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded">
                            {complaint.complaint_number}
                          </span>
                          <Badge className={statusColors[complaint.status]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-start gap-2 text-foreground">
                          <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
                          <div>
                            <p className="font-medium">
                              {complaint.area}
                              {complaint.locality && `, ${complaint.locality}`}
                            </p>
                            <p className="text-sm text-muted-foreground">{complaint.address}</p>
                            {complaint.landmark && (
                              <p className="text-sm text-muted-foreground">
                                Landmark: {complaint.landmark}
                              </p>
                            )}
                          </div>
                        </div>
                        {complaint.description && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {complaint.description}
                          </p>
                        )}
                        {complaint.admin_remarks && (
                          <div className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                            <span className="text-muted-foreground">
                              <span className="font-medium">Remarks:</span> {complaint.admin_remarks}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Assigned: {complaint.assigned_at 
                            ? new Date(complaint.assigned_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'
                          }
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <Select
                          value={complaint.status}
                          onValueChange={(value) => handleUpdateStatus(complaint.id, value)}
                          disabled={updatingId === complaint.id || complaint.status === 'completed'}
                        >
                          <SelectTrigger className="w-[160px]">
                            {updatingId === complaint.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="in_progress">Start Task</SelectItem>
                            <SelectItem value="completed">Mark Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
