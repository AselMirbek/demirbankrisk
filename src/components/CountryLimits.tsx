import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, Edit, Plus, Search, X } from "lucide-react";

const CountryLimits = () => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Risk Management → Country Limits</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Filter Section */}
          <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-muted-foreground">▼</div>
                  <span className="font-medium text-foreground">Filter</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative w-[250px]">
                      <Input
                        placeholder="country code/name"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pr-10"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>

                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Clear Filter
                    </Button>

                    <Button className="bg-success hover:bg-success/90" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Country Limit
                    </Button>

                    <Button className="bg-success hover:bg-success/90" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Landing</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Overlimit</TableHead>
                    <TableHead>Limit Exceeded</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Protocol No</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Last Updated By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">GB</TableCell>
                    <TableCell>Great Britain (United Kingdom)</TableCell>
                    <TableCell>100,000</TableCell>
                    <TableCell>30,000</TableCell>
                    <TableCell>500,000</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted">No</Badge>
                    </TableCell>
                    <TableCell>Unlimited</TableCell>
                    <TableCell className="text-accent">BD-23/2024</TableCell>
                    <TableCell className="text-muted-foreground">2024-10-05</TableCell>
                    <TableCell className="text-muted-foreground">risk_user</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">US</TableCell>
                    <TableCell>United States of America</TableCell>
                    <TableCell>250,000</TableCell>
                    <TableCell>80,000</TableCell>
                    <TableCell>1,000,000</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted">No</Badge>
                    </TableCell>
                    <TableCell>2025-12-31</TableCell>
                    <TableCell className="text-accent">BD-24/2024</TableCell>
                    <TableCell className="text-muted-foreground">2024-11-15</TableCell>
                    <TableCell className="text-muted-foreground">risk_admin</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled>«</Button>
              <Button variant="outline" size="sm" disabled>‹</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">4</Button>
              <Button variant="outline" size="sm">5</Button>
              <Button variant="outline" size="sm">›</Button>
              <Button variant="outline" size="sm">»</Button>
              <Select defaultValue="7">
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Old Limit</TableHead>
                    <TableHead>New Limit</TableHead>
                    <TableHead>Old Valid Until</TableHead>
                    <TableHead>New Valid Until</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">CA</TableCell>
                    <TableCell>100M</TableCell>
                    <TableCell className="text-success font-medium">200M</TableCell>
                    <TableCell>Unlimited</TableCell>
                    <TableCell>2025-05-01</TableCell>
                    <TableCell className="text-accent">BD-10/2025</TableCell>
                    <TableCell className="text-muted-foreground">risk_maker</TableCell>
                    <TableCell className="text-muted-foreground">2025-01-03</TableCell>
                    <TableCell>
                      <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Old Limit</TableHead>
                    <TableHead>New Limit</TableHead>
                    <TableHead>Old Valid Until</TableHead>
                    <TableHead>New Valid Until</TableHead>
                    <TableHead>Old Protocol</TableHead>
                    <TableHead>New Protocol</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Changed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">RU</TableCell>
                    <TableCell>50M</TableCell>
                    <TableCell className="text-success font-medium">100M</TableCell>
                    <TableCell>Unlimited</TableCell>
                    <TableCell>Unlimited</TableCell>
                    <TableCell className="text-muted-foreground">BD-2023</TableCell>
                    <TableCell className="text-accent">BD-2024</TableCell>
                    <TableCell className="text-muted-foreground">risk_maker</TableCell>
                    <TableCell className="text-muted-foreground">risk_checker</TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">Approved</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">2025-01-03</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CountryLimits;
