import { useEffect, useState } from 'react';
import { CheckCircle, Clock, PlayCircle, Users, Layers, TrendingUp } from 'lucide-react';

export default function Dashboard({ users = [], teams = [], tasks = [] }) {
  const [total, setTotal] = useState(0);
  const [todo, setTodo] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [done, setDone] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTotal(tasks.length);
    setTodo(tasks.filter(t => t.status === 'TODO').length);
    setInProgress(tasks.filter(t => t.status === 'IN_PROGRESS').length);
    setDone(tasks.filter(t => t.status === 'DONE').length);
    setTimeout(() => setMounted(true), 100);
  }, [tasks]);

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: mounted ? `${Math.min((value / total) * 100 || 0, 100)}%` : '0%' }}
        />
      </div>
    </div>
  );

  const InfoCard = ({ icon: Icon, label, value, gradient, delay }) => (
    <div 
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-white text-opacity-90 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">Track your team's progress and productivity</p>
        </div>

        {/* Completion Rate Banner */}
        <div 
          className={`mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-xl transform transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90 text-sm font-medium mb-1">Overall Completion Rate</p>
              <p className="text-5xl font-bold text-white">{completionRate}%</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="mt-6 bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1500 ease-out shadow-lg"
              style={{ width: mounted ? `${completionRate}%` : '0%' }}
            />
          </div>
        </div>

        {/* Task Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Layers} 
            label="Total Tasks" 
            value={total} 
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={200}
          />
          <StatCard 
            icon={Clock} 
            label="To Do" 
            value={todo} 
            color="bg-gradient-to-br from-amber-500 to-orange-600"
            delay={300}
          />
          <StatCard 
            icon={PlayCircle} 
            label="In Progress" 
            value={inProgress} 
            color="bg-gradient-to-br from-purple-500 to-indigo-600"
            delay={400}
          />
          <StatCard 
            icon={CheckCircle} 
            label="Done" 
            value={done} 
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
            delay={500}
          />
        </div>

        {/* Team & User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard 
            icon={Layers} 
            label="Total Teams" 
            value={teams.length} 
            gradient="from-violet-500 to-purple-600"
            delay={600}
          />
          <InfoCard 
            icon={Users} 
            label="Total Users" 
            value={users.length} 
            gradient="from-pink-500 to-rose-600"
            delay={700}
          />
        </div>
      </div>
    </div>
  );
}