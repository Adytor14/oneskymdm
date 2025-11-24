import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Check, X, Settings, Database, GitMerge, Loader2, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RuleAttribute {
  id?: string;
  tempId?: string; // For tracking attributes during creation
  attribute_name: string;
  match_category: "exact" | "fuzzy";
  weightage: number | null;
}

interface MergeMatchRule {
  id: string;
  rule_name: string;
  entity_type: "HCP" | "HCO" | "Address" | "SLN";
  match_type: "automatic" | "suspect" | "negative";
  threshold_min: number | null;
  threshold_max: number | null;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  attributes: RuleAttribute[];
}

interface SurvivorshipRule {
  id: string;
  entity_type: "HCP" | "HCO" | "Address" | "SLN";
  attribute_name: string;
  rule_type: "status" | "priority" | "recency" | "aggregation";
  rule_value: string;
  created_at: string;
}

// Validation schema for survivorship rules
const survivorshipRuleSchema = z.object({
  attribute_name: z
    .string()
    .trim()
    .min(1, { message: "Attribute name is required" })
    .max(100, { message: "Attribute name must be less than 100 characters" }),
  rule_type: z.enum(["status", "priority", "recency", "aggregation"], {
    errorMap: () => ({ message: "Please select a valid rule type" }),
  }),
  rule_value: z
    .string()
    .trim()
    .min(1, { message: "Value/Priority is required" })
    .max(500, { message: "Value/Priority must be less than 500 characters" }),
});

const RulesManagement = () => {
  const [activeRuleTab, setActiveRuleTab] = useState("merge-match");
  const [activeEntityTab, setActiveEntityTab] = useState("hcp");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSurvivorshipEditMode, setIsSurvivorshipEditMode] = useState(false);
  const [isCreateSurvivorshipDialogOpen, setIsCreateSurvivorshipDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [survivorshipDeleteDialogOpen, setSurvivorshipDeleteDialogOpen] = useState(false);
  const [survivorshipRuleToDelete, setSurvivorshipRuleToDelete] = useState<string | null>(null);

  // New survivorship rule form state
  const [newSurvivorshipRule, setNewSurvivorshipRule] = useState({
    attribute_name: "",
    rule_type: "priority" as "status" | "priority" | "recency" | "aggregation",
    rule_value: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [mergeMatchRules, setMergeMatchRules] = useState<MergeMatchRule[]>([]);
  const [survivorshipRules, setSurvivorshipRules] = useState<SurvivorshipRule[]>([]);
  const [editedSurvivorshipRules, setEditedSurvivorshipRules] = useState<SurvivorshipRule[]>([]);
  const [editingRule, setEditingRule] = useState<MergeMatchRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  // Form state for creating/editing rules
  const [formData, setFormData] = useState({
    rule_name: "",
    match_type: "automatic" as "automatic" | "suspect" | "negative",
    threshold_min: 90,
    threshold_max: 100,
    is_active: true,
    attributes: [
      { tempId: "attr-1", attribute_name: "NPI", match_category: "exact" as "exact" | "fuzzy", weightage: null },
      { tempId: "attr-2", attribute_name: "First Name", match_category: "fuzzy" as "exact" | "fuzzy", weightage: 25 },
      { tempId: "attr-3", attribute_name: "Last Name", match_category: "fuzzy" as "exact" | "fuzzy", weightage: 25 },
      { tempId: "attr-4", attribute_name: "ZIP", match_category: "exact" as "exact" | "fuzzy", weightage: null },
      { tempId: "attr-5", attribute_name: "Address", match_category: "fuzzy" as "exact" | "fuzzy", weightage: 50 },
    ],
  });

  useEffect(() => {
    fetchRules();
  }, [activeEntityTab]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      // Convert entity tab to uppercase for database query
      const entityType = activeEntityTab === "hcp" ? "HCP" : "HCO";

      // Fetch merge/match rules
      const { data: rulesData, error: rulesError } = await supabase
        .from("merge_match_rules")
        .select("*")
        .eq("entity_type", entityType)
        .order("created_at", { ascending: false });

      if (rulesError) throw rulesError;

      // Fetch attributes for each rule
      const rulesWithAttributes = await Promise.all(
        (rulesData || []).map(async (rule) => {
          const { data: attrsData } = await supabase.from("rule_attributes").select("*").eq("rule_id", rule.id);

          return {
            ...rule,
            attributes: attrsData || [],
          };
        }),
      );

      setMergeMatchRules(rulesWithAttributes);

      // Fetch survivorship rules
      const { data: survData, error: survError } = await supabase
        .from("survivorship_rules")
        .select("*")
        .eq("entity_type", entityType)
        .order("attribute_name");

      if (survError) throw survError;
      setSurvivorshipRules(survData || []);
      setEditedSurvivorshipRules(survData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSurvivorshipRules = async () => {
    setSaving(true);
    try {
      // Update each edited rule
      const updates = editedSurvivorshipRules.map(async (rule) => {
        const { error } = await supabase
          .from("survivorship_rules")
          .update({
            rule_type: rule.rule_type,
            rule_value: rule.rule_value,
          })
          .eq("id", rule.id);

        if (error) throw error;
      });

      await Promise.all(updates);

      toast({
        title: "Success",
        description: "Survivorship rules saved successfully",
      });

      fetchRules();
      setIsSurvivorshipEditMode(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSurvivorshipRule = async () => {
    if (!survivorshipRuleToDelete) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("survivorship_rules").delete().eq("id", survivorshipRuleToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Survivorship rule deleted successfully",
      });

      setSurvivorshipDeleteDialogOpen(false);
      setSurvivorshipRuleToDelete(null);
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSurvivorshipRuleChange = (idx: number, field: "rule_type" | "rule_value", value: string) => {
    const newRules = [...editedSurvivorshipRules];
    newRules[idx] = { ...newRules[idx], [field]: value };
    setEditedSurvivorshipRules(newRules);
  };

  const handleCreateSurvivorshipRule = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Validate input
    try {
      survivorshipRuleSchema.parse(newSurvivorshipRule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        return;
      }
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const entityType = activeEntityTab === "hcp" ? "HCP" : "HCO";

      const { error } = await supabase.from("survivorship_rules").insert({
        entity_type: entityType,
        attribute_name: newSurvivorshipRule.attribute_name.trim(),
        rule_type: newSurvivorshipRule.rule_type,
        rule_value: newSurvivorshipRule.rule_value.trim(),
        created_by: userData.user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Survivorship rule created successfully",
      });

      // Reset form
      setNewSurvivorshipRule({
        attribute_name: "",
        rule_type: "priority",
        rule_value: "",
      });
      setIsCreateSurvivorshipDialogOpen(false);
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRule = async () => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const entityType = activeEntityTab === "hcp" ? "HCP" : "HCO";

      const { data: ruleData, error: ruleError } = await supabase
        .from("merge_match_rules")
        .insert({
          rule_name: formData.rule_name,
          entity_type: entityType,
          match_type: formData.match_type,
          threshold_min: formData.threshold_min,
          threshold_max: formData.threshold_max,
          is_active: formData.is_active,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (ruleError) throw ruleError;

      // Insert attributes
      const attributesToInsert = formData.attributes.map((attr) => ({
        rule_id: ruleData.id,
        attribute_name: attr.attribute_name,
        match_category: attr.match_category,
        weightage: attr.weightage,
      }));

      const { error: attrsError } = await supabase.from("rule_attributes").insert(attributesToInsert);

      if (attrsError) throw attrsError;

      toast({
        title: "Success",
        description: "Rule created successfully",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRule = async () => {
    if (!editingRule) return;

    setSaving(true);
    try {
      const { error: ruleError } = await supabase
        .from("merge_match_rules")
        .update({
          rule_name: formData.rule_name,
          match_type: formData.match_type,
          threshold_min: formData.threshold_min,
          threshold_max: formData.threshold_max,
          is_active: formData.is_active,
        })
        .eq("id", editingRule.id);

      if (ruleError) throw ruleError;

      // Delete old attributes
      await supabase.from("rule_attributes").delete().eq("rule_id", editingRule.id);

      // Insert new attributes
      const attributesToInsert = formData.attributes.map((attr) => ({
        rule_id: editingRule.id,
        attribute_name: attr.attribute_name,
        match_category: attr.match_category,
        weightage: attr.weightage,
      }));

      const { error: attrsError } = await supabase.from("rule_attributes").insert(attributesToInsert);

      if (attrsError) throw attrsError;

      toast({
        title: "Success",
        description: "Rule updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingRule(null);
      resetForm();
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async () => {
    if (!ruleToDelete) return;

    setSaving(true);
    try {
      // Delete attributes first (foreign key constraint)
      await supabase.from("rule_attributes").delete().eq("rule_id", ruleToDelete);

      // Delete rule
      const { error } = await supabase.from("merge_match_rules").delete().eq("id", ruleToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });

      setDeleteDialogOpen(false);
      setRuleToDelete(null);
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRuleStatus = async (ruleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("merge_match_rules").update({ is_active: !currentStatus }).eq("id", ruleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Rule ${!currentStatus ? "activated" : "deactivated"}`,
      });

      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      rule_name: "",
      match_type: "automatic",
      threshold_min: 90,
      threshold_max: 100,
      is_active: true,
      attributes: [
        { tempId: "attr-1", attribute_name: "NPI", match_category: "exact", weightage: null },
        { tempId: "attr-2", attribute_name: "First Name", match_category: "fuzzy", weightage: 25 },
        { tempId: "attr-3", attribute_name: "Last Name", match_category: "fuzzy", weightage: 25 },
        { tempId: "attr-4", attribute_name: "ZIP", match_category: "exact", weightage: null },
        { tempId: "attr-5", attribute_name: "Address", match_category: "fuzzy", weightage: 50 },
      ],
    });
  };

  const openEditDialog = (rule: MergeMatchRule) => {
    setEditingRule(rule);
    setFormData({
      rule_name: rule.rule_name,
      match_type: rule.match_type,
      threshold_min: rule.threshold_min || 90,
      threshold_max: rule.threshold_max || 100,
      is_active: rule.is_active,
      attributes: rule.attributes.map((attr, idx) => ({
        id: attr.id,
        tempId: attr.id || `edit-attr-${idx}`,
        attribute_name: attr.attribute_name,
        match_category: attr.match_category,
        weightage: attr.weightage,
      })),
    });
    setIsEditDialogOpen(true);
  };

  const RuleCard = ({ rule }: { rule: MergeMatchRule }) => (
    <Card
      className={cn(
        "group transition-all hover:shadow-md",
        rule.is_active
          ? "border-l-2 border-l-primary"
          : "border-l-2 border-l-muted-foreground/30 opacity-80",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{rule.rule_name}</CardTitle>
              {rule.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {rule.match_type.charAt(0).toUpperCase() + rule.match_type.slice(1)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog(rule)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          {rule.attributes.slice(0, 4).map((attr, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm">{attr.attribute_name}</span>
              <Badge variant="outline" className="text-xs">
                {attr.match_category === "exact" ? "Exact" : `Fuzzy ${attr.weightage}%`}
              </Badge>
            </div>
          ))}
          {rule.attributes.length > 4 && (
            <p className="text-xs text-muted-foreground text-center py-1">
              +{rule.attributes.length - 4} more
            </p>
          )}
        </div>

        {(rule.threshold_min !== null || rule.threshold_max !== null) && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Threshold: {rule.threshold_min}% - {rule.threshold_max}%
            </p>
          </div>
        )}

        <div className="pt-2 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{new Date(rule.created_at).toLocaleDateString()}</p>
          <Switch
            checked={rule.is_active}
            onCheckedChange={() => handleToggleRuleStatus(rule.id, rule.is_active)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const RuleDialog = ({ isEdit = false }: { isEdit?: boolean }) => (
    <Dialog
      open={isEdit ? isEditDialogOpen : isCreateDialogOpen}
      onOpenChange={isEdit ? setIsEditDialogOpen : setIsCreateDialogOpen}
    >
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Create New Rule
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            {isEdit ? "Edit" : "Create"} Merge/Match Rule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rule Name */}
          <div className="space-y-2">
            <Label htmlFor="rule-name" className="text-sm font-semibold">
              Rule Name *
            </Label>
            <Input
              id="rule-name"
              placeholder="e.g., Primary HCP Matching Rule"
              value={formData.rule_name}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({ ...prev, rule_name: value }));
              }}
              className="text-base"
            />
          </div>

          {/* Match Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="match-type" className="text-sm font-semibold">
                Match Type *
              </Label>
              <Select
                value={formData.match_type}
                onValueChange={(value: any) => {
                  setFormData((prev) => ({ ...prev, match_type: value }));
                }}
              >
                <SelectTrigger id="match-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="suspect">Suspect</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Rule Status</Label>
              <div className="flex items-center h-10 px-3 border rounded-md">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, is_active: checked }));
                  }}
                />
                <span className="ml-2 text-sm">{formData.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Attributes Table */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Matching Attributes
            </Label>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground grid grid-cols-[2fr,2fr,1fr] gap-4 p-4 font-semibold text-sm">
                <div>Attribute</div>
                <div>Match Category</div>
                <div className="text-center">Weight (%)</div>
              </div>

              <div className="divide-y">
                {formData.attributes.map((attr, idx) => {
                  const uniqueKey = attr.tempId || `attr-${idx}-${attr.attribute_name}`;
                  return (
                    <div
                      key={uniqueKey}
                      className="grid grid-cols-[2fr,2fr,1fr] gap-4 p-4 items-center hover:bg-muted/50 transition-colors"
                    >
                      <Input
                        value={attr.attribute_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => {
                            const newAttrs = [...prev.attributes];
                            newAttrs[idx] = { ...newAttrs[idx], attribute_name: value };
                            return { ...prev, attributes: newAttrs };
                          });
                        }}
                        placeholder="Attribute name"
                      />

                      <RadioGroup
                        value={attr.match_category}
                        onValueChange={(value: any) => {
                          setFormData((prev) => {
                            const newAttrs = [...prev.attributes];
                            newAttrs[idx] = { ...newAttrs[idx], match_category: value };
                            return { ...prev, attributes: newAttrs };
                          });
                        }}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="exact" id={`exact-${uniqueKey}`} />
                          <Label htmlFor={`exact-${uniqueKey}`} className="font-normal cursor-pointer">
                            Exact
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fuzzy" id={`fuzzy-${uniqueKey}`} />
                          <Label htmlFor={`fuzzy-${uniqueKey}`} className="font-normal cursor-pointer">
                            Fuzzy
                          </Label>
                        </div>
                      </RadioGroup>

                      <Input
                        type="number"
                        value={attr.weightage ?? ""}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value) : null;
                          setFormData((prev) => {
                            const newAttrs = [...prev.attributes];
                            newAttrs[idx] = { ...newAttrs[idx], weightage: value };
                            return { ...prev, attributes: newAttrs };
                          });
                        }}
                        placeholder="N/A"
                        disabled={attr.match_category === "exact"}
                        className="text-center"
                        min="0"
                        max="100"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  attributes: [
                    ...prev.attributes,
                    { 
                      tempId: `attr-${Date.now()}`,
                      attribute_name: "", 
                      match_category: "exact", 
                      weightage: null 
                    },
                  ],
                }));
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Attribute
            </Button>
          </div>

          <Separator />

          {/* Threshold */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Fuzzy Match Threshold (%)</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={formData.threshold_min}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormData((prev) => ({ ...prev, threshold_min: value }));
                  }}
                  min="0"
                  max="100"
                  placeholder="Min"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={formData.threshold_max}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormData((prev) => ({ ...prev, threshold_max: value }));
                  }}
                  min="0"
                  max="100"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              isEdit ? setIsEditDialogOpen(false) : setIsCreateDialogOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button onClick={isEdit ? handleUpdateRule : handleCreateRule} disabled={saving || !formData.rule_name}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {isEdit ? "Update" : "Create"} Rule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const filteredRules = (type: "automatic" | "suspect" | "negative") =>
    mergeMatchRules.filter((rule) => rule.match_type === type);

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">
              Rules Management
            </h1>
            <p className="text-muted-foreground text-lg">Configure intelligent merge, match, and survivorship rules</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeRuleTab} onValueChange={setActiveRuleTab} className="space-y-6">
          <TabsList className="bg-muted p-1 h-auto">
            <TabsTrigger
              value="merge-match"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <GitMerge className="h-4 w-4 mr-2" />
              Merge/Match Rules
            </TabsTrigger>
            <TabsTrigger
              value="survivorship"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <Database className="h-4 w-4 mr-2" />
              Survivorship Rules
            </TabsTrigger>
          </TabsList>

          {/* Merge/Match Rules Tab */}
          <TabsContent value="merge-match" className="space-y-6">
            <Tabs value={activeEntityTab} onValueChange={setActiveEntityTab}>
              <div className="flex justify-between items-center">
                <TabsList className="bg-muted">
                  <TabsTrigger
                    value="hcp"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Physician Accounts
                  </TabsTrigger>
                  <TabsTrigger
                    value="hco"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Facility Accounts
                  </TabsTrigger>
                </TabsList>
                <RuleDialog />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Automatic Rules */}
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent border-l-4 border-green-500">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">Automatic Matches</h3>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        {filteredRules("automatic").length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRules("automatic").map((rule, idx) => (
                        <div key={rule.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in">
                          <RuleCard rule={rule} />
                        </div>
                      ))}
                      {filteredRules("automatic").length === 0 && (
                        <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px] col-span-full">
                          <p className="text-muted-foreground">No automatic rules yet</p>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Suspect Rules */}
                  <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 dark:to-transparent border-l-4 border-orange-500">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <GitMerge className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">Suspect Matches</h3>
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                        {filteredRules("suspect").length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRules("suspect").map((rule, idx) => (
                        <div key={rule.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in">
                          <RuleCard rule={rule} />
                        </div>
                      ))}
                      {filteredRules("suspect").length === 0 && (
                        <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px] col-span-full">
                          <p className="text-muted-foreground">No suspect rules yet</p>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Tabs>
          </TabsContent>

          {/* Survivorship Rules Tab */}
          <TabsContent value="survivorship" className="space-y-6 animate-fade-in">
            {/* Modern Header */}

            <Tabs value={activeEntityTab} onValueChange={setActiveEntityTab}>
              <TabsList className="bg-muted">
                <TabsTrigger
                  value="hcp"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Physician Accounts
                </TabsTrigger>
                <TabsTrigger
                  value="hco"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Facility Accounts
                </TabsTrigger>
              </TabsList>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Attribute Level Survivorship
                    </CardTitle>
                    <div className="flex gap-2">
                      <Dialog open={isCreateSurvivorshipDialogOpen} onOpenChange={setIsCreateSurvivorshipDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Rule
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">
                              <Database className="h-6 w-6 text-primary" />
                              Create Survivorship Rule
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="attribute-name" className="text-sm font-semibold">
                                Attribute Name *
                              </Label>
                              <Input
                                id="attribute-name"
                                placeholder="e.g., PDRP, First Name, Email"
                                value={newSurvivorshipRule.attribute_name}
                                onChange={(e) => {
                                  setNewSurvivorshipRule({
                                    ...newSurvivorshipRule,
                                    attribute_name: e.target.value,
                                  });
                                  setValidationErrors({ ...validationErrors, attribute_name: "" });
                                }}
                                className={cn(validationErrors.attribute_name && "border-destructive")}
                                maxLength={100}
                              />
                              {validationErrors.attribute_name && (
                                <p className="text-sm text-destructive">{validationErrors.attribute_name}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="rule-type" className="text-sm font-semibold">
                                Rule Type *
                              </Label>
                              <Select
                                value={newSurvivorshipRule.rule_type}
                                onValueChange={(value: any) => {
                                  setNewSurvivorshipRule({
                                    ...newSurvivorshipRule,
                                    rule_type: value,
                                  });
                                  setValidationErrors({ ...validationErrors, rule_type: "" });
                                }}
                              >
                                <SelectTrigger
                                  id="rule-type"
                                  className={cn(validationErrors.rule_type && "border-destructive")}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                  <SelectItem value="status">Status</SelectItem>
                                  <SelectItem value="priority">Priority</SelectItem>
                                  <SelectItem value="recency">Recency</SelectItem>
                                  <SelectItem value="aggregation">Aggregation</SelectItem>
                                </SelectContent>
                              </Select>
                              {validationErrors.rule_type && (
                                <p className="text-sm text-destructive">{validationErrors.rule_type}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="rule-value" className="text-sm font-semibold">
                                Value/Priority *
                              </Label>
                              <Input
                                id="rule-value"
                                placeholder="e.g., Yes, DCR, VEEVA Open Data (VOD)"
                                value={newSurvivorshipRule.rule_value}
                                onChange={(e) => {
                                  setNewSurvivorshipRule({
                                    ...newSurvivorshipRule,
                                    rule_value: e.target.value,
                                  });
                                  setValidationErrors({ ...validationErrors, rule_value: "" });
                                }}
                                className={cn(validationErrors.rule_value && "border-destructive")}
                                maxLength={500}
                              />
                              {validationErrors.rule_value && (
                                <p className="text-sm text-destructive">{validationErrors.rule_value}</p>
                              )}
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsCreateSurvivorshipDialogOpen(false);
                                setNewSurvivorshipRule({
                                  attribute_name: "",
                                  rule_type: "priority",
                                  rule_value: "",
                                });
                                setValidationErrors({});
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleCreateSurvivorshipRule}
                              disabled={saving}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Create Rule
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={handleSaveSurvivorshipRules}
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Database className="h-4 w-4 mr-2" />
                            Save Rules
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-[2fr,1.5fr,3fr,auto] gap-4 p-4 bg-muted font-semibold">
                        <div>Attribute Name</div>
                        <div>Rule Type</div>
                        <div>Value/Priority</div>
                        <div className="text-center">Actions</div>
                      </div>
                      <div className="divide-y">
                        {editedSurvivorshipRules.map((rule, idx) => (
                            <div
                              key={rule.id}
                              className="grid grid-cols-[2fr,1.5fr,3fr,auto] gap-4 p-4 items-center hover:bg-muted/50 transition-colors"
                            >
                              <div className="font-medium">
                                {rule.attribute_name}
                              </div>
                              <div>
                                <Select
                                  value={rule.rule_type}
                                  onValueChange={(value: any) => handleSurvivorshipRuleChange(idx, "rule_type", value)}
                                >
                                  <SelectTrigger className="w-full">
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
                                <Input
                                  value={rule.rule_value}
                                  onChange={(e) => handleSurvivorshipRuleChange(idx, "rule_value", e.target.value)}
                                  placeholder="Enter value or priority"
                                />
                              </div>
                              <div className="flex justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSurvivorshipRuleToDelete(rule.id);
                                    setSurvivorshipDeleteDialogOpen(true);
                                  }}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                        ))}
                        {editedSurvivorshipRules.length === 0 && (
                          <div className="p-12 text-center">
                            <p className="text-muted-foreground">No survivorship rules configured yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && <RuleDialog isEdit={true} />}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRule}
              className="bg-destructive hover:bg-destructive/90"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Survivorship Rule Delete Confirmation Dialog */}
      <AlertDialog open={survivorshipDeleteDialogOpen} onOpenChange={setSurvivorshipDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Delete Survivorship Rule
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this survivorship rule? This action cannot be undone and will permanently
              remove the rule from your configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSurvivorshipRule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Rule"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RulesManagement;
