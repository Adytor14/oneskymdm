import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const DataChangeRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("dcr-fields");
  const [isPrimaryInfoOpen, setIsPrimaryInfoOpen] = useState(true);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);
  const [isParentAffiliationOpen, setIsParentAffiliationOpen] = useState(true);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");

  const mockRequest = {
    taskId: "9310282363735619197",
    subject: "Sarah Johnson",
    primaryAddress: "123 Medical Plaza, Boston, MA 02115, USA",
    creator: "rishiraj.acharya@iponesky.com",
    source: "Epic EMR",
    requestDate: "16/10/2025",
    requestedBy: "Rishiraj Acharyya",
    assignee: "Ujjwal Sirothia",
    status: "Pending Review",
    comments: "Update the address of this HCP as he has relocated",
  };

  const changeFields = [
    {
      category: "Primary Information",
      fields: [
        { attribute: "Status", currentValue: "Active", changeRequest: "Active", hasChange: false },
      ],
    },
    {
      category: "Personal Information",
      fields: [
        { attribute: "NPI ID", currentValue: "1234567890", changeRequest: "1234567890", hasChange: false },
        { attribute: "First Name", currentValue: "Sarah", changeRequest: "Sayrah", hasChange: true },
        { attribute: "Last Name", currentValue: "Johnson", changeRequest: "Johanson", hasChange: true },
        { attribute: "Address", currentValue: "123 Medical Plaza, Boston, MA 02115, USA", changeRequest: "123 Medical Plaza, Boston, MA 02115, USA", hasChange: false },
        { attribute: "Org ID", currentValue: "ORG-12345", changeRequest: "ORG-12345", hasChange: false },
      ],
    },
    {
      category: "Parent Affiliation",
      fields: [],
    },
  ];

  const handleApprove = () => {
    if (!approvalNote.trim()) {
      toast({
        title: "Approval Note Required",
        description: "Please add an approval note before approving the DCR.",
        variant: "destructive",
      });
      return;
    }
    
    // Handle approval logic here
    toast({
      title: "DCR Approved",
      description: "The data change request has been successfully approved.",
    });
    setIsApproveDialogOpen(false);
    setApprovalNote("");
    navigate(-1);
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
            <div key={idx} className="grid grid-cols-4 gap-4 p-3 border-t items-center hover:bg-muted/25">
              <div className="text-muted-foreground">{field.attribute}</div>
              <div>{field.currentValue}</div>
              <div className={field.hasChange ? "text-orange-600 font-medium" : ""}>
                {field.changeRequest}
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Data Change Request Detail</h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Change Request Review</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">DCR History</Button>
                  <Button variant="outline" size="sm">Re-assign</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                  <Button variant="outline" size="sm">Save</Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90" 
                    size="sm"
                    onClick={() => setIsApproveDialogOpen(true)}
                  >
                    Approve
                  </Button>
                </div>
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
                  <div className="grid grid-cols-4 gap-4 p-3 bg-primary text-primary-foreground font-medium">
                    <div>Attributes</div>
                    <div>Current Value</div>
                    <div>Change Request</div>
                    <div>Action</div>
                  </div>
                  <CategorySection
                    category="Primary Information"
                    fields={changeFields[0].fields}
                    isOpen={isPrimaryInfoOpen}
                    setIsOpen={setIsPrimaryInfoOpen}
                  />
                  <CategorySection
                    category="Personal Information"
                    fields={changeFields[1].fields}
                    isOpen={isPersonalInfoOpen}
                    setIsOpen={setIsPersonalInfoOpen}
                  />
                  <CategorySection
                    category="Parent Affiliation"
                    fields={changeFields[2].fields}
                    isOpen={isParentAffiliationOpen}
                    setIsOpen={setIsParentAffiliationOpen}
                  />
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

        <Card className="w-80">
          <CardHeader className="bg-yellow-50 border-b">
            <CardTitle className="text-lg">Request Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Task ID</p>
              <p className="text-sm font-medium">{mockRequest.taskId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="text-sm font-medium">{mockRequest.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Primary Address</p>
              <p className="text-sm font-medium">{mockRequest.primaryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Creator</p>
              <p className="text-sm font-medium">{mockRequest.creator}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-sm font-medium">{mockRequest.source}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p className="text-sm font-medium">{mockRequest.requestDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested By</p>
              <p className="text-sm font-medium">{mockRequest.requestedBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requester Comments</p>
              <p className="text-sm font-medium">{mockRequest.comments}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assignee</p>
              <p className="text-sm font-medium">{mockRequest.assignee}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-orange-500 hover:bg-orange-600">{mockRequest.status}</Badge>
            </div>
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
    </div>
  );
};

export default DataChangeRequestDetail;
