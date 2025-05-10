'use client'

import { Suspense } from 'react';
import AccountModal from '@/components/admin/auth/profile';

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountModal visible={true} onClose={() => { }} />
    </Suspense>
  );
}

