import { Subscription } from '@/lib/supabase/supabase.types';
import { AuthUser } from '@supabase/supabase-js';
import React from 'react'

interface DashboardSetupProps {
    user: AuthUser;
    subscription: Subscription | null;
    
}

const DashboardSetup:React.FC<DashboardSetupProps> = () => {
  return (
    <div>DashboardSetup</div>
  )
}

export default DashboardSetup