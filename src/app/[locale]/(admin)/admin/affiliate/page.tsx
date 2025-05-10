import { Suspense } from 'react';
import ListAffiliate from "@/components/admin/affiliate/listAffiliate";

export default function AffiliatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ListAffiliate />
        </Suspense>
    )
}