import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'NOTHING HERE YET.',
  description = 'No pieces match your current criteria. Check back soon for the next drop.',
  actionText = 'EXPLORE ARCHIVE',
  actionHref = '/shop',
  onAction,
}) => {
  return (
    <div className="py-20 px-6 text-center border border-randere-border bg-randere-card/30 flex flex-col items-center justify-center my-8">
      <span className="text-xs font-mono tracking-mega text-randere-muted uppercase mb-3">
        [ EMPTY ARCHIVE ]
      </span>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-randere-chalk">
        {title}
      </h3>
      <p className="text-randere-muted text-sm max-w-md mx-auto mb-8 font-light">
        {description}
      </p>
      {actionHref ? (
        <Link
          to={actionHref}
          className="inline-block bg-randere-chalk text-black px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-randere-accent transition-colors"
        >
          {actionText}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-block bg-randere-chalk text-black px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-randere-accent transition-colors"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};
