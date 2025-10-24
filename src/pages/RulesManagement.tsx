import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RulesManagement = () => {
  const [activeRuleTab, setActiveRuleTab] = useState("merge-match");
  const [activeEntityTab, setActiveEntityTab] = useState("hcp");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mockRules = {
    automatic: [
      {
        name: "Rule 1",
        attributes: [
          { name: "NPI", exact: true, fuzzy: false },
          { name: "First Name", exact: true, fuzzy: false },
          { name: "Last Name", exact: true, fuzzy: false },
          { name: "ZIP", exact: true, fuzzy: false },
        ],
        createdDate: "20-10-2025",
        createdBy: "Ujjwal Sirothia",
      },
      {
        name: "Rule 2",
        attributes: [
          { name: "NPI", exact: true, fuzzy: false },
          { name: "First Name", exact: true, fuzzy: false },
          { name: "Last Name", exact: true, fuzzy: false },
          { name: "ZIP", exact: true, fuzzy: false },
        ],
        createdDate: "21-10-2025",
        createdBy: "Ujjwal Sirothia",
      },
    ],
    suspect: [
      {
        name: "Rule 1",
        attributes: [
          { name: "NPI", exact: true, fuzzy: false },
          { name: "First Name", exact: true, fuzzy: false },
          { name: "Last Name", exact: true, fuzzy: false },
          { name: "ZIP", exact: true, fuzzy: false },
        ],
        createdDate: "22-10-2025",
        createdBy: "Ujjwal Sirothia",
      },
    ],
    negative: [
      {
        name: "Rule 1",
        attributes: [
          { name: "NPI", exact: true, fuzzy: false },
          { name: "First Name", exact: true, fuzzy: false },
          { name: "Last Name", exact: true, fuzzy: false },
          { name: "ZIP", exact: true, fuzzy: false },
        ],
        createdDate: "22-10-2025",
        createdBy: "Ujjwal Sirothia",
      },
    ],
  };

  const RuleCard = ({ rule }: any) => (
    <Card className="relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2">
        <Pencil className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-base">{rule.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rule.attributes.map((attr: any, idx: number) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{attr.name}</span>
            <div className="flex gap-2">
              <Badge variant={attr.exact ? "default" : "outline"} className="text-xs">
                Exact
              </Badge>
              <Badge variant={attr.fuzzy ? "default" : "outline"} className="text-xs">
                Fuzzy
              </Badge>
            </div>
          </div>
        ))}
        <div className="pt-2 text-xs text-muted-foreground border-t mt-4">
          <p>Created on {rule.createdDate}, Created by {rule.createdBy}</p>
        </div>
      </CardContent>
    </Card>
  );

  const CreateRuleDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create a New Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Merge/Match Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Rule Name</Label>
            <Input placeholder="New HCP Merge/Match Rules" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type of Match</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="suspect">Suspect</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Attribute</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="npi">NPI</SelectItem>
                  <SelectItem value="firstname">First Name</SelectItem>
                  <SelectItem value="lastname">Last Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground grid grid-cols-3 p-3 font-medium">
              <div>Attributes</div>
              <div>Category</div>
              <div>Weightage</div>
            </div>
            {["NPI", "First Name", "Last Name", "ZIP", "Address"].map((attr, idx) => (
              <div key={idx} className="grid grid-cols-3 p-3 border-t items-center">
                <div className="text-muted-foreground">{attr}</div>
                <div>
                  <RadioGroup defaultValue={idx === 0 || idx === 3 ? "exact" : "fuzzy"} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exact" id={`exact-${idx}`} />
                      <Label htmlFor={`exact-${idx}`}>Exact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fuzzy" id={`fuzzy-${idx}`} />
                      <Label htmlFor={`fuzzy-${idx}`}>Fuzzy</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  {attr === "NPI" || attr === "ZIP" ? (
                    <span className="text-muted-foreground">NA</span>
                  ) : (
                    <Input type="number" defaultValue={attr === "Address" ? "50" : "25"} className="w-24" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Label>Threshold (Fuzzy Match)</Label>
            <Input type="number" defaultValue="90" className="w-24" />
            <span>—</span>
            <Input type="number" defaultValue="100" className="w-24" />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90">Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rules Management</h1>
          <p className="text-muted-foreground mt-1">Configure merge/match and survivorship rules</p>
        </div>
      </div>

      <Tabs value={activeRuleTab} onValueChange={setActiveRuleTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="merge-match" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Merge/Match Rules
          </TabsTrigger>
          <TabsTrigger value="survivorship" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Survivorship Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="merge-match" className="space-y-6">
          <Tabs value={activeEntityTab} onValueChange={setActiveEntityTab}>
            <div className="flex justify-between items-center">
              <TabsList className="bg-muted">
                <TabsTrigger value="hcp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  HCP
                </TabsTrigger>
                <TabsTrigger value="hco" className="data-[state=active]:bg-muted-foreground">
                  HCO
                </TabsTrigger>
              </TabsList>
              <CreateRuleDialog />
            </div>

            <TabsContent value="hcp" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">AUTOMATIC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRules.automatic.map((rule, idx) => (
                    <RuleCard key={idx} rule={rule} />
                  ))}
                  <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px]">
                    <Button variant="ghost" className="text-muted-foreground">
                      <Plus className="h-6 w-6 mr-2" />
                      New HCP Merge/Match Rules
                    </Button>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">SUSPECT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRules.suspect.map((rule, idx) => (
                    <RuleCard key={idx} rule={rule} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">NEGATIVE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRules.negative.map((rule, idx) => (
                    <RuleCard key={idx} rule={rule} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hco" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">AUTOMATIC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RuleCard rule={mockRules.automatic[0]} />
                  <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px]">
                    <Button variant="ghost" className="text-muted-foreground">
                      <Plus className="h-6 w-6 mr-2" />
                      New HCO Merge/Match Rules
                    </Button>
                  </Card>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">SUSPECT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RuleCard rule={mockRules.suspect[0]} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">NEGATIVE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RuleCard rule={mockRules.negative[0]} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="survivorship" className="space-y-6">
          <Tabs value={activeEntityTab} onValueChange={setActiveEntityTab}>
            <TabsList className="bg-muted">
              <TabsTrigger value="hcp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                HCP
              </TabsTrigger>
              <TabsTrigger value="hco" className="data-[state=active]:bg-muted-foreground">
                HCO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hcp" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Attribute Level</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">Save</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-primary text-primary-foreground grid grid-cols-3 p-3 font-medium">
                      <div>Attribute Name</div>
                      <div>Rule</div>
                      <div>Value</div>
                    </div>
                    {[
                      { name: "PDRP", rule: "Status", value: "Yes" },
                      { name: "First Name", rule: "Priority", value: "DCR VEEVA Open Data (VOD) Definitive Health Care (DHC) AMA Transaction Data ConcertAI DSE Website" },
                      { name: "Email", rule: "Recency", value: "NA" },
                      { name: "Address", rule: "Aggregation", value: "Primary-DCR" },
                      { name: "Last Name", rule: "Priority", value: "DCR VEEVA Open Data (VOD) Definitive Health Care (DHC) AMA Transaction Data ConcertAI DSE Website" },
                    ].map((attr, idx) => (
                      <div key={idx} className="grid grid-cols-3 p-3 border-t items-center">
                        <div className="text-muted-foreground">{attr.name}</div>
                        <div>
                          <Select defaultValue={attr.rule.toLowerCase()}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="status">Status</SelectItem>
                              <SelectItem value="priority">Priority</SelectItem>
                              <SelectItem value="recency">Recency</SelectItem>
                              <SelectItem value="aggregation">Aggregation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Select defaultValue={attr.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={attr.value}>{attr.value}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hco">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">HCO Survivorship Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Configure survivorship rules for HCO entities</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RulesManagement;
