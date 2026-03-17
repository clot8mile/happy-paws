import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  PawPrint, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit
} from "lucide-react";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";

function getFirstImage(images: any, fallback: string = ""): string {
  if (Array.isArray(images) && images.length > 0) return images[0];
  if (typeof images === 'string') {
    if (images.startsWith('{')) return images.replace(/[\{\}]/g, '').split(',')[0];
    if (images.startsWith('http')) return images;
  }
  return fallback;
}

interface Application {
  id: string;
  pet_id: string;
  user_id: string;
  status: 'pending' | 'interviewing' | 'approved' | 'rejected';
  applicant_name: string;
  applicant_phone: string;
  living_city: string;
  housing_type: string;
  has_experience: boolean;
  adoption_reason: string;
  created_at: string;
  profiles?: { name: string; avatar: string };
  pets?: { id: string; name: string; image: string };
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age_months: number;
  gender: string;
  image: string;
  is_adopted: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { authUser, profile } = useUser();
  const [activeTab, setActiveTab] = useState<'applications' | 'pets'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      alert("无访问权限：您不是管理员");
      navigate("/profile");
      return;
    }
    loadData(activeTab);
  }, [profile, navigate, activeTab]);

  const loadData = async (tab: 'applications' | 'pets') => {
    setIsLoading(true);
    try {
      if (tab === 'applications') {
        const data = await api.get<any>('/adoptions/admin/all').catch(() => []);
        setApplications(data || []);
      } else {
        const data = await api.get<any>('/pets/admin/all').catch(() => []);
        setPets(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/adoptions/admin/${id}/status`, { status: newStatus });
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus as any } : app)
      );
    } catch (err) {
      alert("状态更新失败");
    }
  };

  const togglePetAdoptionStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/pets/admin/${id}`, { is_adopted: !currentStatus });
      setPets(prev => 
        prev.map(pet => pet.id === id ? { ...pet, is_adopted: !currentStatus } : pet)
      );
    } catch (err) {
      alert("宠物状态更新失败");
    }
  };

  const deletePet = async (id: string) => {
    if (!window.confirm("确定要删除这只宠物吗？相关的领养申请可能会失效。")) return;
    try {
      await api.delete(`/pets/admin/${id}`);
      setPets(prev => prev.filter(pet => pet.id !== id));
    } catch (err) {
      alert("宠物删除失败");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/>待审核</span>;
      case 'interviewing': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><Users className="w-3 h-3"/>面试中</span>;
      case 'approved': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3"/>已通过</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/>已拒绝</span>;
      default: return null;
    }
  };

  if (profile?.role !== 'admin') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-slate-50 min-h-screen pb-safe"
    >
      {/* Header */}
      <header className="bg-slate-900 text-white px-5 pt-12 pb-6 flex flex-col items-center relative shadow-md">
        <button
          onClick={() => navigate("/profile")}
          className="absolute left-4 top-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ShieldCheck className="w-12 h-12 text-[#07C160] mb-2" />
        <h1 className="text-xl font-bold">救助站管理后台</h1>
        <p className="text-sm text-slate-300 mt-1">管理员: {profile.name}</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        <button
          className={`flex-1 py-4 text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === 'applications' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('applications')}
        >
          <FileText className="w-4 h-4"/> 领养申请
        </button>
        <button
          className={`flex-1 py-4 text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === 'pets' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('pets')}
        >
          <PawPrint className="w-4 h-4"/> 宠物管理
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin w-8 h-8 border-4 border-[#07C160] border-t-transparent rounded-full"></div>
          </div>
        ) : activeTab === 'applications' ? (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-gray-100">
                暂无领养申请
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900">{app.applicant_name} 申请领养 <span className="text-[#07C160]">{app.pets?.name || '宠物'}</span></h3>
                      <p className="text-xs text-slate-500 mt-1">提交于: {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm space-y-1">
                    <p><span className="text-slate-500">电话:</span> {app.applicant_phone}</p>
                    <p><span className="text-slate-500">城市/住房:</span> {app.living_city} / {app.housing_type}</p>
                    <p><span className="text-slate-500">养宠经验:</span> {app.has_experience ? '有' : '无'}</p>
                    <p><span className="text-slate-500">理由:</span> {app.adoption_reason}</p>
                  </div>

                  <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => updateStatus(app.id, 'interviewing')}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                    >
                      邀约面试
                    </button>
                    <button 
                      onClick={() => updateStatus(app.id, 'approved')}
                      className="flex-1 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors"
                    >
                      通过审核
                    </button>
                    <button 
                      onClick={() => updateStatus(app.id, 'rejected')}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      拒绝
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pets.length === 0 ? (
               <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-gray-100">
                 暂无宠物记录
               </div>
            ) : (
               pets.map((pet) => (
                 <div key={pet.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                   <img src={getFirstImage((pet as any).images || pet.image)} alt={pet.name} className="w-16 h-16 rounded-xl object-cover" />
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <h3 className="font-bold text-slate-900">{pet.name}</h3>
                       {pet.is_adopted && (
                         <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">已领养</span>
                       )}
                     </div>
                     <p className="text-xs text-slate-500 mt-1">{pet.breed} · {pet.age_months}个月 · {pet.gender === 'male' ? '男孩' : '女孩'}</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => togglePetAdoptionStatus(pet.id, pet.is_adopted)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${pet.is_adopted ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}
                      >
                        {pet.is_adopted ? '设为待领养' : '标记已领养'}
                      </button>
                      <button 
                        onClick={() => deletePet(pet.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                       <Trash2 className="w-3 h-3"/> 删除
                      </button>
                   </div>
                 </div>
               ))
            )}
          </div>
        )}
      </main>
    </motion.div>
  );
}
