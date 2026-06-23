"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  Lock, 
  Download, 
  Copy, 
  ExternalLink, 
  Eye, 
  Database,
  Users,
  Calendar,
  Check,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PIN_SESSION_KEY = "evoto_admin_authenticated";

export default function AdminDashboard() {
  const leads = useQuery(api.leads.getLeads);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Check PIN from env or default
  const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "2026";

  useEffect(() => {
    const saved = sessionStorage.getItem(PIN_SESSION_KEY);
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(PIN_SESSION_KEY, "true");
      setPinError("");
    } else {
      setPinError("Invalid security PIN");
      setPinInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(PIN_SESSION_KEY);
    setPinInput("");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!leads || leads.length === 0) return;

    const headers = ["Full Name", "Email Address", "Contact Number", "WhatsApp Number", "Requirement Description", "Submission Date"];
    const rows = leads.map(lead => [
      lead.fullName,
      lead.email,
      lead.contactNumber,
      lead.whatsAppNumber,
      lead.requirement || "",
      new Date(lead._creationTime).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `evoto_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard placeholder/action
  const handleCopyClipboard = () => {
    if (!leads || leads.length === 0) return;

    const text = leads.map(lead => 
      `Name: ${lead.fullName}\nEmail: ${lead.email}\nPhone: ${lead.contactNumber}\nWhatsApp: ${lead.whatsAppNumber}\nRequirement: ${lead.requirement || "None"}\n---`
    ).join("\n\n");

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 1. PIN Security Overlay
  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-zinc-950 text-white relative px-4">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-zinc-800/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-md w-full z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-zinc-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Authentication</h1>
            <p className="text-sm text-zinc-500 mt-1">Please enter your kiosk dashboard security PIN</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-sm font-medium text-zinc-400">
                  Security PIN Code
                </Label>
                <Input
                  id="pin"
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="h-14 bg-zinc-950 border-zinc-800 text-white text-center text-2xl tracking-widest rounded-xl focus-visible:ring-zinc-700"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs font-semibold text-rose-500 text-center mt-1">{pinError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-white hover:bg-zinc-200 text-black text-lg font-semibold rounded-xl transition-all"
              >
                Access Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Admin Dashboard View
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-zinc-50">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-zinc-200 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-8 select-none pointer-events-none">
              <Image
                src="/logo.png"
                alt="Evoto Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="border-l border-zinc-200 pl-4">
              <h1 className="text-lg font-bold text-zinc-900 leading-none">Evoto Leads</h1>
              <p className="text-[10px] text-zinc-400 font-medium mt-1">Exhibition Admin Console</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm"
            className="text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Lock Console
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-6 sm:px-8 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center space-x-4">
            <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-500">Total Leads Collected</span>
              <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{leads?.length ?? 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center space-x-4">
            <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-700">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-500">Today's Leads</span>
              <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">
                {leads ? leads.filter(l => new Date(l._creationTime).toDateString() === new Date().toDateString()).length : 0}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center space-x-4">
            <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-700">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-500">Database Connection</span>
              <h3 className="text-sm font-bold text-emerald-600 mt-1 flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
                Convex Cloud Connected
              </h3>
            </div>
          </div>
        </div>

        {/* Lead Table Container */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Leads List</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Showing all submission records</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleCopyClipboard}
                disabled={!leads || leads.length === 0}
                variant="outline"
                className="text-zinc-700 border-zinc-200 h-10 px-4 rounded-xl text-sm"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
              <Button 
                onClick={handleExportCSV}
                disabled={!leads || leads.length === 0}
                className="bg-zinc-950 hover:bg-zinc-800 text-white h-10 px-4 rounded-xl text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {leads === undefined ? (
              <div className="py-20 text-center text-zinc-400 font-medium flex flex-col items-center justify-center">
                <span className="h-8 w-8 rounded-full border-2 border-zinc-200 border-t-zinc-950 animate-spin mb-4"></span>
                Fetching Leads Database...
              </div>
            ) : leads.length === 0 ? (
              <div className="py-20 text-center text-zinc-400 font-medium">
                No lead records found. Use the kiosk at root route to capture submissions!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-zinc-50/50">
                    <TableHead className="font-bold text-zinc-700">Full Name</TableHead>
                    <TableHead className="font-bold text-zinc-700">Email</TableHead>
                    <TableHead className="font-bold text-zinc-700">Contact</TableHead>
                    <TableHead className="font-bold text-zinc-700">WhatsApp</TableHead>
                    <TableHead className="font-bold text-zinc-700">Date Collected</TableHead>
                    <TableHead className="font-bold text-zinc-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead._id} className="hover:bg-zinc-50/50">
                      <TableCell className="font-semibold text-zinc-950">{lead.fullName}</TableCell>
                      <TableCell className="text-zinc-600">{lead.email}</TableCell>
                      <TableCell className="text-zinc-600 font-mono text-sm">{lead.contactNumber}</TableCell>
                      <TableCell className="text-zinc-600 font-mono text-sm">{lead.whatsAppNumber}</TableCell>
                      <TableCell className="text-zinc-500 text-sm">
                        {new Date(lead._creationTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger
                            render={
                              <Button 
                                onClick={() => setSelectedLead(lead)}
                                variant="ghost" 
                                size="sm" 
                                className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 rounded-lg px-2"
                              />
                            }
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View Needs
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-6">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-zinc-900">
                                {selectedLead?.fullName}
                              </DialogTitle>
                              <DialogDescription className="text-xs text-zinc-500">
                                Submitted on {selectedLead && new Date(selectedLead._creationTime).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4 border-t border-b border-zinc-100 my-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-xs text-zinc-400 font-medium block">Email Address</span>
                                  <span className="font-semibold text-zinc-900 block truncate">{selectedLead?.email}</span>
                                </div>
                                <div>
                                  <span className="text-xs text-zinc-400 font-medium block">Contact Number</span>
                                  <span className="font-semibold text-zinc-900 block font-mono">{selectedLead?.contactNumber}</span>
                                </div>
                                <div>
                                  <span className="text-xs text-zinc-400 font-medium block">WhatsApp Number</span>
                                  <span className="font-semibold text-zinc-900 block font-mono">{selectedLead?.whatsAppNumber}</span>
                                </div>
                              </div>
                              <div className="pt-2">
                                <span className="text-xs text-zinc-400 font-medium block mb-1">Requirement Description</span>
                                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 text-sm text-zinc-700 max-h-[200px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                                  {selectedLead?.requirement || (
                                    <span className="italic text-zinc-400">No requirements specified by user.</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end pt-2">
                              <Button 
                                onClick={() => {
                                  if (selectedLead) {
                                    navigator.clipboard.writeText(
                                      `Name: ${selectedLead.fullName}\nEmail: ${selectedLead.email}\nPhone: ${selectedLead.contactNumber}\nWhatsApp: ${selectedLead.whatsAppNumber}\nRequirement: ${selectedLead.requirement || "None"}`
                                    );
                                    alert("Details copied to clipboard!");
                                  }
                                }}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-10 px-4 text-sm"
                              >
                                Copy Single Record
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
