import App from '@/App';
import type {
    PublicProject,
    PublicCta,
    PublicSiteSettings,
} from '@/types';

interface HomeProps {
    initialData?: {
        settings: PublicSiteSettings | null;
        projects: PublicProject[];
        cta: PublicCta | null;
    };
    settings?: PublicSiteSettings | null;
    projects?: PublicProject[];
    cta?: PublicCta | null;
}

export default function Home(props: HomeProps) {
    const initialData = props?.initialData || {
        settings: props?.settings ?? null,
        projects: props?.projects ?? [],
        cta: props?.cta ?? null,
    };

    return <App initialData={initialData} />;
}