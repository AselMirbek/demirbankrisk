import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, Edit, Plus, Search, X } from "lucide-react";
import EditCountryLimitDialog from "./EditCountryLimitDialog";

// Generate 50 records for General tab
const generateGeneralData = () => {
  const countries = [
    { code: "GB", name: "Great Britain (United Kingdom)" },
    { code: "US", name: "United States of America" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "BE", name: "Belgium" },
    { code: "CH", name: "Switzerland" },
    { code: "AT", name: "Austria" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "PL", name: "Poland" },
    { code: "CZ", name: "Czech Republic" },
    { code: "HU", name: "Hungary" },
    { code: "RO", name: "Romania" },
    { code: "BG", name: "Bulgaria" },
    { code: "GR", name: "Greece" },
    { code: "PT", name: "Portugal" },
    { code: "IE", name: "Ireland" },
    { code: "LU", name: "Luxembourg" },
    { code: "SI", name: "Slovenia" },
    { code: "SK", name: "Slovakia" },
    { code: "EE", name: "Estonia" },
    { code: "LV", name: "Latvia" },
    { code: "LT", name: "Lithuania" },
    { code: "HR", name: "Croatia" },
    { code: "RS", name: "Serbia" },
    { code: "UA", name: "Ukraine" },
    { code: "TR", name: "Turkey" },
    { code: "RU", name: "Russian Federation" },
    { code: "CN", name: "China" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "IN", name: "India" },
    { code: "AU", name: "Australia" },
    { code: "NZ", name: "New Zealand" },
    { code: "CA", name: "Canada" },
    { code: "MX", name: "Mexico" },
    { code: "BR", name: "Brazil" },
    { code: "AR", name: "Argentina" },
    { code: "CL", name: "Chile" },
    { code: "ZA", name: "South Africa" },
    { code: "EG", name: "Egypt" },
    { code: "NG", name: "Nigeria" },
    { code: "KE", name: "Kenya" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "AE", name: "United Arab Emirates" },
  ];

  return countries.map((country, i) => ({
    code: country.code,
    name: country.name,
    balance: `${Math.floor(Math.random() * 500 + 50)},000`,
    landing: `${Math.floor(Math.random() * 100 + 10)},000`,
    limit: `${Math.floor(Math.random() * 1000 + 200)},000`,
    overlimit: Math.random() > 0.7 ? `${Math.floor(Math.random() * 50)},000` : "0",
    limitExceeded: Math.random() > 0.8 ? "Yes" : "No",
    validUntil: Math.random() > 0.5 ? "Unlimited" : `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    protocolNo: `BD-${i + 1}/2024`,
    lastUpdated: `2024-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    lastUpdatedBy: ["risk_user", "risk_admin", "risk_manager", "risk_officer"][Math.floor(Math.random() * 4)],
  }));
};

// Generate 50 records for Pending tab
const generatePendingData = () => {
  const countries = [
    { code: "CA", name: "Canada" },
    { code: "SG", name: "Singapore" },
    { code: "MY", name: "Malaysia" },
    { code: "TH", name: "Thailand" },
    { code: "ID", name: "Indonesia" },
    { code: "PH", name: "Philippines" },
    { code: "VN", name: "Vietnam" },
    { code: "PK", name: "Pakistan" },
    { code: "BD", name: "Bangladesh" },
    { code: "LK", name: "Sri Lanka" },
    { code: "MM", name: "Myanmar" },
    { code: "KH", name: "Cambodia" },
    { code: "LA", name: "Laos" },
    { code: "NP", name: "Nepal" },
    { code: "AF", name: "Afghanistan" },
    { code: "IQ", name: "Iraq" },
    { code: "IR", name: "Iran" },
    { code: "IL", name: "Israel" },
    { code: "JO", name: "Jordan" },
    { code: "LB", name: "Lebanon" },
    { code: "SY", name: "Syria" },
    { code: "YE", name: "Yemen" },
    { code: "OM", name: "Oman" },
    { code: "KW", name: "Kuwait" },
    { code: "QA", name: "Qatar" },
    { code: "BH", name: "Bahrain" },
    { code: "AM", name: "Armenia" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "GE", name: "Georgia" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TJ", name: "Tajikistan" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "MN", name: "Mongolia" },
    { code: "BY", name: "Belarus" },
    { code: "MD", name: "Moldova" },
    { code: "AL", name: "Albania" },
    { code: "MK", name: "North Macedonia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "ME", name: "Montenegro" },
    { code: "XK", name: "Kosovo" },
    { code: "CY", name: "Cyprus" },
    { code: "MT", name: "Malta" },
    { code: "IS", name: "Iceland" },
    { code: "LI", name: "Liechtenstein" },
    { code: "MC", name: "Monaco" },
    { code: "SM", name: "San Marino" },
    { code: "VA", name: "Vatican City" },
    { code: "AD", name: "Andorra" },
  ];

  return countries.map((country, i) => ({
    code: country.code,
    countryName: country.name,
    oldLimit: `${Math.floor(Math.random() * 300 + 50)}M`,
    newLimit: `${Math.floor(Math.random() * 500 + 200)}M`,
    oldValidUntil: Math.random() > 0.5 ? "Unlimited" : `2024-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    newValidUntil: `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    protocol: `BD-${i + 100}/2025`,
    requestedBy: ["risk_maker", "risk_analyst", "risk_specialist"][Math.floor(Math.random() * 3)],
    requestedAt: `2025-01-${String(Math.floor(Math.random() * 20 + 1)).padStart(2, '0')}`,
  }));
};

// Generate 50 records for History tab
const generateHistoryData = () => {
  const countries = [
    { code: "RU", name: "Russian Federation" },
    { code: "PE", name: "Peru" },
    { code: "CO", name: "Colombia" },
    { code: "VE", name: "Venezuela" },
    { code: "EC", name: "Ecuador" },
    { code: "BO", name: "Bolivia" },
    { code: "PY", name: "Paraguay" },
    { code: "UY", name: "Uruguay" },
    { code: "CR", name: "Costa Rica" },
    { code: "PA", name: "Panama" },
    { code: "GT", name: "Guatemala" },
    { code: "HN", name: "Honduras" },
    { code: "SV", name: "El Salvador" },
    { code: "NI", name: "Nicaragua" },
    { code: "CU", name: "Cuba" },
    { code: "DO", name: "Dominican Republic" },
    { code: "JM", name: "Jamaica" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "BB", name: "Barbados" },
    { code: "BS", name: "Bahamas" },
    { code: "BZ", name: "Belize" },
    { code: "GY", name: "Guyana" },
    { code: "SR", name: "Suriname" },
    { code: "MA", name: "Morocco" },
    { code: "DZ", name: "Algeria" },
    { code: "TN", name: "Tunisia" },
    { code: "LY", name: "Libya" },
    { code: "SD", name: "Sudan" },
    { code: "ET", name: "Ethiopia" },
    { code: "SO", name: "Somalia" },
    { code: "UG", name: "Uganda" },
    { code: "TZ", name: "Tanzania" },
    { code: "MZ", name: "Mozambique" },
    { code: "ZW", name: "Zimbabwe" },
    { code: "ZM", name: "Zambia" },
    { code: "MW", name: "Malawi" },
    { code: "BW", name: "Botswana" },
    { code: "NA", name: "Namibia" },
    { code: "AO", name: "Angola" },
    { code: "CM", name: "Cameroon" },
    { code: "GH", name: "Ghana" },
    { code: "CI", name: "Ivory Coast" },
    { code: "SN", name: "Senegal" },
    { code: "ML", name: "Mali" },
    { code: "NE", name: "Niger" },
    { code: "TD", name: "Chad" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BJ", name: "Benin" },
    { code: "TG", name: "Togo" },
    { code: "GN", name: "Guinea" },
  ];

  return countries.map((country, i) => ({
    code: country.code,
    countryName: country.name,
    oldLimit: `${Math.floor(Math.random() * 200 + 30)}M`,
    newLimit: `${Math.floor(Math.random() * 400 + 150)}M`,
    oldValidUntil: Math.random() > 0.5 ? "Unlimited" : `2023-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    newValidUntil: Math.random() > 0.5 ? "Unlimited" : `2024-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    oldProtocol: `BD-${i + 1}/2023`,
    newProtocol: `BD-${i + 1}/2024`,
    changedBy: ["risk_maker", "risk_analyst", "risk_officer"][Math.floor(Math.random() * 3)],
    approvedBy: ["risk_checker", "risk_supervisor", "risk_director"][Math.floor(Math.random() * 3)],
    changedAt: `2024-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
  }));
};

const CountryLimits = () => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [generalData, setGeneralData] = useState(generateGeneralData());
  const [pendingData, setPendingData] = useState(generatePendingData());
  const historyData = generateHistoryData();
const navigate = useNavigate();

  const handleEdit = (country: any) => {
    setSelectedCountry(country);
    setEditDialogOpen(true);
  };

  const handleSave = (updatedCountry: any) => {
    setGeneralData(generalData.map(c => 
      c.code === updatedCountry.code ? updatedCountry : c
    ));
  };

  const handleDelete = (code: string) => {
    setPendingData(pendingData.filter(item => item.code !== code));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Risk Management → Country Limits</h1>
        </div>

        
<div className="mb-4">
  <Button
    className="bg-primary text-primary-foreground"
    onClick={() => navigate("/admin")}
  >
    Go to Admin Panel
  </Button>
</div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">General</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">Pending</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-muted data-[state=active]:text-foreground">History</TabsTrigger>
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
                        className="absolute right-0 top-0 h-full px-3 hover:bg-accent/10"
                      >
                        <Search className="h-4 w-4 text-accent" />
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="border-r border-border">Code</TableHead>
                      <TableHead className="border-r border-border">Name</TableHead>
                      <TableHead className="border-r border-border">Balance</TableHead>
                      <TableHead className="border-r border-border">Landing</TableHead>
                      <TableHead className="border-r border-border">Limit</TableHead>
                      <TableHead className="border-r border-border">Overlimit</TableHead>
                      <TableHead className="border-r border-border">Limit Exceeded</TableHead>
                      <TableHead className="border-r border-border">Valid Until</TableHead>
                      <TableHead className="border-r border-border">Protocol No</TableHead>
                      <TableHead className="border-r border-border">Last Updated</TableHead>
                      <TableHead className="border-r border-border">Last Updated By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generalData.map((row, idx) => (
                      <TableRow key={idx} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="font-medium border-r border-border">{row.code}</TableCell>
                        <TableCell className="border-r border-border">{row.name}</TableCell>
                        <TableCell className="border-r border-border">{row.balance}</TableCell>
                        <TableCell className="border-r border-border">{row.landing}</TableCell>
                        <TableCell className="border-r border-border">{row.limit}</TableCell>
                        <TableCell className="border-r border-border">{row.overlimit}</TableCell>
                        <TableCell className="border-r border-border">
                          <Badge variant="outline" className={row.limitExceeded === "Yes" ? "bg-destructive/10 text-destructive" : "bg-muted"}>
                            {row.limitExceeded}
                          </Badge>
                        </TableCell>
                        <TableCell className="border-r border-border">{row.validUntil}</TableCell>
                        <TableCell className="text-accent border-r border-border">{row.protocolNo}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.lastUpdated}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.lastUpdatedBy}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-accent hover:text-accent/80"
                            onClick={() => handleEdit(row)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="border-r border-border">Country</TableHead>
                      <TableHead className="border-r border-border">Country Name</TableHead>
                      <TableHead className="border-r border-border">Old Limit</TableHead>
                      <TableHead className="border-r border-border">New Limit</TableHead>
                      <TableHead className="border-r border-border">Old Valid Until</TableHead>
                      <TableHead className="border-r border-border">New Valid Until</TableHead>
                      <TableHead className="border-r border-border">Protocol</TableHead>
                      <TableHead className="border-r border-border">Requested By</TableHead>
                      <TableHead className="border-r border-border">Requested At</TableHead>
                      <TableHead className="border-r border-border">Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingData.map((row, idx) => (
                      <TableRow key={idx} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="font-medium border-r border-border">{row.code}</TableCell>
                        <TableCell className="border-r border-border">{row.countryName}</TableCell>
                        <TableCell className="border-r border-border">{row.oldLimit}</TableCell>
                        <TableCell className="text-success font-medium border-r border-border">{row.newLimit}</TableCell>
                        <TableCell className="border-r border-border">{row.oldValidUntil}</TableCell>
                        <TableCell className="border-r border-border">{row.newValidUntil}</TableCell>
                        <TableCell className="text-accent border-r border-border">{row.protocol}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.requestedBy}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.requestedAt}</TableCell>
                        <TableCell className="border-r border-border">
                          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDelete(row.code)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="border-r border-border">Country</TableHead>
                      <TableHead className="border-r border-border">Country Name</TableHead>
                      <TableHead className="border-r border-border">Old Limit</TableHead>
                      <TableHead className="border-r border-border">New Limit</TableHead>
                      <TableHead className="border-r border-border">Old Valid Until</TableHead>
                      <TableHead className="border-r border-border">New Valid Until</TableHead>
                      <TableHead className="border-r border-border">Old Protocol</TableHead>
                      <TableHead className="border-r border-border">New Protocol</TableHead>
                      <TableHead className="border-r border-border">Changed By</TableHead>
                      <TableHead className="border-r border-border">Approved By</TableHead>
                      <TableHead className="border-r border-border">Status</TableHead>
                      <TableHead>Changed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.map((row, idx) => (
                      <TableRow key={idx} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="font-medium border-r border-border">{row.code}</TableCell>
                        <TableCell className="border-r border-border">{row.countryName}</TableCell>
                        <TableCell className="border-r border-border">{row.oldLimit}</TableCell>
                        <TableCell className="text-success font-medium border-r border-border">{row.newLimit}</TableCell>
                        <TableCell className="border-r border-border">{row.oldValidUntil}</TableCell>
                        <TableCell className="border-r border-border">{row.newValidUntil}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.oldProtocol}</TableCell>
                        <TableCell className="text-accent border-r border-border">{row.newProtocol}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.changedBy}</TableCell>
                        <TableCell className="text-muted-foreground border-r border-border">{row.approvedBy}</TableCell>
                        <TableCell className="border-r border-border">
                          <Badge className="bg-success text-success-foreground">Approved</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{row.changedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditCountryLimitDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        country={selectedCountry}
        onSave={handleSave}
      />
    </div>
  );
};

export default CountryLimits;
