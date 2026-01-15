"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminData } from "@/app/actions";
import { motion } from "motion/react";
import { Users, UserX, MousePointerClick, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getAdminData();
        setData(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Auto refresh every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#090D31] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <Link href="/" className="text-teal-500 flex items-center gap-2 mb-2 hover:underline">
                            <ArrowLeft size={16} /> Back to Site
                        </Link>
                        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">JustBook Waitlist Performance</p>
                    </div>
                    <Button
                        onClick={fetchData}
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 gap-2"
                    >
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh Data
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        title="Total Registered"
                        value={data?.stats?.signups ?? 0}
                        icon={<Users className="text-[#12A19A]" />}
                        color="teal"
                    />
                    <StatCard
                        title="Active Opt-Outs"
                        value={data?.optOuts?.length ?? 0}
                        icon={<UserX className="text-[#FF921E]" />}
                        color="orange"
                    />
                    <StatCard
                        title="Survey Interactions"
                        value={data?.stats?.surveyTaps ?? 0}
                        icon={<MousePointerClick className="text-blue-400" />}
                        color="blue"
                    />
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Registered Table */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users size={20} className="text-[#12A19A]" /> Registered Emails
                            </h2>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full text-left">
                                <tbody>
                                    {data?.registered?.map((email: string, idx: number) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm font-medium">{email}</td>
                                            <td className="p-4 text-right text-xs text-muted-foreground">Active</td>
                                        </tr>
                                    )) || (
                                            <tr><td className="p-8 text-center text-muted-foreground">No signups yet.</td></tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Opt-Outs Table */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <UserX size={20} className="text-[#FF921E]" /> Opt-Out History
                            </h2>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full text-left">
                                <tbody>
                                    {data?.optOuts?.map((email: string, idx: number) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="p-4 text-sm font-medium text-muted-foreground">{email}</td>
                                            <td className="p-4 text-right">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-orange-500/30 text-orange-500">Unsubscribed</span>
                                            </td>
                                        </tr>
                                    )) || (
                                            <tr><td className="p-8 text-center text-muted-foreground">None so far.</td></tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const accentColor = color === 'teal' ? '#12A19A' : color === 'orange' ? '#FF921E' : '#60a5fa';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all shadow-xl"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full translate-x-8 -translate-y-8" />
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div style={{ backgroundColor: accentColor }} className="w-1.5 h-6 rounded-full opacity-50" />
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </motion.div>
    );
}
