import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DataChangeRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("dcr-fields");
  const [isPrimaryInfoOpen, setIsPrimaryInfoOpen] = useState(true);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('change_requests')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setRequest(data);
      } catch (error) {
        console.error('Error fetching request:', error);
        toast({
          title: "Error",
          description: "Failed to load request details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!request) {
    return <div className="p-6">Request not found</div>;
  }

  // Check if DCR is in an actionable state (not approved or rejected)
  const isActionable = request.status.toLowerCase() !== "approved" && request.status.toLowerCase() !== "rejected";

  const availableAssignees = [
    { id: "1", name: "Ujjwal Sirothia", email: "ujjwal.sirothia@iponesky.com" },
    { id: "2", name: "Rishiraj Acharyya", email: "rishiraj.acharya@iponesky.com" },
    { id: "3", name: "Sarah Johnson", email: "sarah.johnson@iponesky.com" },
    { id: "4", name: "Michael Chen", email: "michael.chen@iponesky.com" },
  ];

  const dcrHistory = [
    {
      action: "Created",
      user: "Rishiraj Acharyya",
      timestamp: "16/10/2025 09:30 AM",
      note: "Initial DCR submission for address update",
    },
    {
      action: "Assigned",
      user: "System",
      timestamp: "16/10/2025 09:31 AM",
      note: "Automatically assigned to Ujjwal Sirothia",
    },
    {
      action: "Reviewed",
      user: "Ujjwal Sirothia",
      timestamp: "16/10/2025 02:15 PM",
      note: "Reviewed field changes - First Name and Last Name modifications detected",
    },
  ];

  // Get single field based on request type
  const getDCRField = () => {
    const requestedChanges = request.requested_changes as Record<string, any> || {};
    const requestType = request.request_type?.toLowerCase() || '';

    if (requestType === 'update_status' || requestType === 'update status') {
      return { 
        attribute: "Status", 
        currentValue: requestedChanges.status?.original || "Active", 
        changeRequest: requestedChanges.status?.new || requestedChanges.status?.original || "Active", 
        hasChange: requestedChanges.status?.original !== requestedChanges.status?.new && !!requestedChanges.status?.new
      };
    }

    if (requestType === 'update_address' || requestType === 'update address') {
      // Combine address fields into a single display
      const originalAddress = [
        requestedChanges.street?.original,
        requestedChanges.city?.original,
        requestedChanges.state?.original,
        requestedChanges.zipCode?.original,
        requestedChanges.country?.original
      ].filter(Boolean).join(', ') || "-";
      
      const newAddress = [
        requestedChanges.street?.new || requestedChanges.street?.original,
        requestedChanges.city?.new || requestedChanges.city?.original,
        requestedChanges.state?.new || requestedChanges.state?.original,
        requestedChanges.zipCode?.new || requestedChanges.zipCode?.original,
        requestedChanges.country?.new || requestedChanges.country?.original
      ].filter(Boolean).join(', ') || "-";

      return { 
        attribute: "Address", 
        currentValue: originalAddress, 
        changeRequest: newAddress, 
        hasChange: originalAddress !== newAddress
      };
    }

    if (requestType === 'update_contact' || requestType === 'update contact') {
      // Combine contact fields into a single display
      const originalContact = [
        requestedChanges.email?.original,
        requestedChanges.phone?.original
      ].filter(Boolean).join(' | ') || "-";
      
      const newContact = [
        requestedChanges.email?.new || requestedChanges.email?.original,
        requestedChanges.phone?.new || requestedChanges.phone?.original
      ].filter(Boolean).join(' | ') || "-";

      return { 
        attribute: "Contact", 
        currentValue: originalContact, 
        changeRequest: newContact, 
        hasChange: originalContact !== newContact
      };
    }

    // Fallback
    return { 
      attribute: "Change", 
      currentValue: "-", 
      changeRequest: "-", 
      hasChange: false
    };
  };

  const dcrField = getDCRField();

  const handleApprove = () => {
    if (!approvalNote.trim()) {
      toast({
        title: "Approval Note Required",
        description: "Please add an approval note before approving the DCR.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "DCR Approved",
      description: "The data change request has been successfully approved.",
    });
    setIsApproveDialogOpen(false);
    setApprovalNote("");
    navigate(-1);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting the DCR.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "DCR Rejected",
      description: "The data change request has been rejected.",
      variant: "destructive",
    });
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    navigate(-1);
  };

  const handleReassign = () => {
    if (!selectedAssignee) {
      toast({
        title: "Assignee Required",
        description: "Please select an assignee to reassign the DCR.",
        variant: "destructive",
      });
      return;
    }
    
    const assignee = availableAssignees.find(a => a.id === selectedAssignee);
    toast({
      title: "DCR Reassigned",
      description: `The data change request has been reassigned to ${assignee?.name}.`,
    });
    setIsReassignDialogOpen(false);
    setSelectedAssignee("");
  };

  const CategorySection = ({ category, fields, isOpen, setIsOpen }: any) => (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-b">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-muted/50">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-medium">{category}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {fields.map((field: any, idx: number) => (
            <div key={idx} className="grid grid-cols-3 gap-4 p-3 border-t items-center hover:bg-muted/25">
              <div className="text-muted-foreground">{field.attribute}</div>
              <div>{field.currentValue}</div>
              <div className={field.hasChange ? "text-orange-600 font-medium" : ""}>
                {field.changeRequest}
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Data Change Request Detail</h1>
        </div>
        <Badge 
          className={`text-sm px-4 py-2 ${
            request.status.toLowerCase() === "approved" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : request.status.toLowerCase() === "rejected" 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {request.status}
        </Badge>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card className={`${
            request.status.toLowerCase() === "approved" 
              ? "border-l-4 border-l-green-500" 
              : request.status.toLowerCase() === "rejected" 
              ? "border-l-4 border-l-red-500" 
              : "border-l-4 border-l-orange-500"
          }`}>
            <CardHeader className={`border-b ${
              request.status.toLowerCase() === "approved" 
                ? "bg-green-50 dark:bg-green-950/20" 
                : request.status.toLowerCase() === "rejected" 
                ? "bg-red-50 dark:bg-red-950/20" 
                : "bg-orange-50 dark:bg-orange-950/20"
            }`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">Change Request Review</CardTitle>
                  <Badge 
                    className={`${
                      request.status.toLowerCase() === "approved" 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : request.status.toLowerCase() === "rejected" 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                  >
                    {request.status}
                  </Badge>
                </div>
                {isActionable && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsHistoryDialogOpen(true)}>
                      DCR History
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsReassignDialogOpen(true)}>
                      Re-assign
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setIsRejectDialogOpen(true)}>
                      Reject
                    </Button>
                    <Button 
                      className="bg-primary hover:bg-primary/90" 
                      size="sm"
                      onClick={() => setIsApproveDialogOpen(true)}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="all-fields">All Fields</TabsTrigger>
                    <TabsTrigger 
                      value="dcr-fields"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      DCR Fields
                    </TabsTrigger>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Collapse All
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      Expand All
                    </Button>
                  </TabsList>
                </div>

                <TabsContent value="dcr-fields" className="m-0">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-primary text-primary-foreground font-medium">
                    <div>Attributes</div>
                    <div>Current Value</div>
                    <div>Change Request</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-3 border-b items-center hover:bg-muted/25">
                    <div className="text-muted-foreground">{dcrField.attribute}</div>
                    <div>{dcrField.currentValue}</div>
                    <div className={dcrField.hasChange ? "text-orange-600 font-medium" : ""}>
                      {dcrField.changeRequest}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="all-fields" className="m-0">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-primary text-primary-foreground font-medium">
                    <div>Attributes</div>
                    <div>Previous Value</div>
                    <div>Current Value</div>
                  </div>
                  <div className="p-6 text-center text-muted-foreground">
                    All fields view will display complete profile information
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className={`w-80 ${
          request.status.toLowerCase() === "approved" 
            ? "border-l-4 border-l-green-500" 
            : request.status.toLowerCase() === "rejected" 
            ? "border-l-4 border-l-red-500" 
            : "border-l-4 border-l-orange-500"
        }`}>
          <CardHeader className={`border-b ${
            request.status.toLowerCase() === "approved" 
              ? "bg-green-50 dark:bg-green-950/20" 
              : request.status.toLowerCase() === "rejected" 
              ? "bg-red-50 dark:bg-red-950/20" 
              : "bg-orange-50 dark:bg-orange-950/20"
          }`}>
            <CardTitle className="text-lg">Request Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">DCR ID</p>
              <p className="text-sm font-medium">{request.dcr_id || `DCR-${request.id.slice(0, 8)}`}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entity Type</p>
              <p className="text-sm font-medium">{request.entity_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entity ID</p>
              <p className="text-sm font-medium">{request.entity_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Type</p>
              <p className="text-sm font-medium">{request.request_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p className="text-sm font-medium">{new Date(request.created_at).toLocaleDateString("en-GB")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested By</p>
              <p className="text-sm font-medium">{request.requested_by}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requester Comments</p>
              <p className="text-sm font-medium">{request.reason || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="text-sm font-medium">{request.priority}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={`${
                request.status.toLowerCase() === "approved" 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : request.status.toLowerCase() === "rejected" 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}>
                {request.status}
              </Badge>
            </div>
            {request.approved_by && (
              <div>
                <p className="text-sm text-muted-foreground">Approved/Rejected By</p>
                <p className="text-sm font-medium">{request.approved_by}</p>
              </div>
            )}
            {request.approved_at && (
              <div>
                <p className="text-sm text-muted-foreground">Approved/Rejected At</p>
                <p className="text-sm font-medium">{new Date(request.approved_at).toLocaleDateString("en-GB")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Approve DCR</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Approval Note <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Add your approval note..."
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsApproveDialogOpen(false);
                setApprovalNote("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject DCR</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Provide reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>DCR History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {dcrHistory.map((item, index) => (
              <div key={index} className="border-l-2 border-primary pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline">{item.action}</Badge>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
                <p className="text-sm font-medium">{item.user}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Re-assign DCR</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Assignee <span className="text-red-500">*</span>
            </label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select an assignee" />
              </SelectTrigger>
              <SelectContent>
                {availableAssignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    <div>
                      <div className="font-medium">{assignee.name}</div>
                      <div className="text-xs text-muted-foreground">{assignee.email}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsReassignDialogOpen(false);
                setSelectedAssignee("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleReassign}>
              Re-assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataChangeRequestDetail;
