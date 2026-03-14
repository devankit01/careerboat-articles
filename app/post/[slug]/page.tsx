import { redirect } from 'next/navigation';

type LegacyPostRouteProps = {
  params: { slug: string };
};

export default function LegacyPostRoute({ params }: LegacyPostRouteProps) {
  redirect(`/${params.slug}`);
}
