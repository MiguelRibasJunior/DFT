import App from '@/App';
import type {
    PublicProject,
    PublicCta,
    PublicSiteSettings,
} from '@/types';

interface HomeProps {
    initialData: {
        settings: PublicSiteSettings | null;
        projects: PublicProject[];
        cta: PublicCta | null;
    };
}

export default function Home({ initialData }: HomeProps) {
    return <App initialData={initialData} />;
}