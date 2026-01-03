import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Loader2,
  AlertCircle,
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
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  assigned: AlertCircle,
  in_progress: AlertCircle,
  completed: CheckCircle2,
  rejected: AlertCircle,
};

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Complaint Form
  const [newComplaint, setNewComplaint] = useState({
    area: '',
    locality: '',
    landmark: '',
    address: '',
    description: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/user/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const fetchComplaints = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setComplaints(data as Complaint[]);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load complaints.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComplaint.area || !newComplaint.address) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in area and address.',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    const { error } = await supabase.from('complaints').insert([{
      user_id: user?.id as string,
      area: newComplaint.area,
      locality: newComplaint.locality || null,
      landmark: newComplaint.landmark || null,
      address: newComplaint.address,
      description: newComplaint.description || null,
      notes: newComplaint.notes || null,
    } as any]);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Complaint Submitted!',
        description: 'Your complaint has been registered successfully.',
      });
      setNewComplaint({
        area: '',
        locality: '',
        landmark: '',
        address: '',
        description: '',
        notes: '',
      });
      fetchComplaints();
    }
    
    setSubmitting(false);
  };

  const getStats = () => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending' || c.status === 'assigned' || c.status === 'in_progress').length;
    const completed = complaints.filter((c) => c.status === 'completed').length;
    return { total, pending, completed };
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
          <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground">Report and track waste management complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Complaints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Complaint
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Complaint History
            </TabsTrigger>
          </TabsList>

          {/* Create Complaint Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Complaint</CardTitle>
                <CardDescription>
                  Report a waste management issue in your locality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComplaint} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Area *</Label>
                      <Input
                        id="area"
                        placeholder="Enter area name"
                        value={newComplaint.area}
                        onChange={(e) => setNewComplaint({ ...newComplaint, area: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locality">Locality</Label>
                      <Input
                        id="locality"
                        placeholder="Enter locality"
                        value={newComplaint.locality}
                        onChange={(e) => setNewComplaint({ ...newComplaint, locality: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      placeholder="Nearby landmark for easy identification"
                      value={newComplaint.landmark}
                      onChange={(e) => setNewComplaint({ ...newComplaint, landmark: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      placeholder="Complete address of the issue"
                      value={newComplaint.address}
                      onChange={(e) => setNewComplaint({ ...newComplaint, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the waste issue in detail"
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information"
                      value={newComplaint.notes}
                      onChange={(e) => setNewComplaint({ ...newComplaint, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Complaint
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaint History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Your Complaints</CardTitle>
                    <CardDescription>Track the status of your submitted complaints</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No complaints found</p>
                    <p className="text-sm text-muted-foreground">
                      Submit your first complaint using the form above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredComplaints.map((complaint) => {
                      const StatusIcon = statusIcons[complaint.status] || Clock;
                      return (
                        <div
                          key={complaint.id}
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded">
                                  {complaint.complaint_number}
                                </span>
                                <Badge className={statusColors[complaint.status]}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {complaint.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="font-medium text-foreground">
                                {complaint.area}
                                {complaint.locality && ` - ${complaint.locality}`}
                              </p>
                              <p className="text-sm text-muted-foreground">{complaint.address}</p>
                              {complaint.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {complaint.description}
                                </p>
                              )}
                              {complaint.admin_remarks && (
                                <div className="bg-muted/50 p-2 rounded text-sm">
                                  <span className="font-medium">Admin Remarks:</span>{' '}
                                  {complaint.admin_remarks}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
