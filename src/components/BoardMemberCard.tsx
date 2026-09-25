import { User } from 'lucide-react';

interface BoardMemberCardProps {
  name: string;
  role: string;
  bio: string;
}

export function BoardMemberCard({ name, role, bio }: BoardMemberCardProps) {
  const initials = name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s+/i, '')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="card card-hover group">
      <div className="flex items-start gap-4">
        <div className="avatar-disc group-hover:bg-brand-100 group-hover:scale-105">
          <span className="text-sm font-bold" aria-hidden="true">
            {initials}
          </span>
          <User className="sr-only" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-brand-900 group-hover:text-brand-800 transition-colors">
            {name}
          </h3>
          <p className="text-xs font-medium uppercase tracking-wider text-rose-700 transition-colors duration-300 group-hover:text-rose-800">
            {role}
          </p>
          <p className="mt-2 text-sm text-slate-600">{bio}</p>
        </div>
      </div>
    </div>
  );
}
