import React from 'react';
import { TableHeader } from './TableHeader';
import { CardRow } from './CardRow';

export const CardTable = ({
  cards,
  sortBy,
  sortDirection,
  onSort,
  onCardHover,
  onMouseMove,
  onCardLeave
}) => {
  const SPLIT_THRESHOLD = 20;
  const shouldSplit = cards.length > SPLIT_THRESHOLD;

  if (shouldSplit) {
    const midpoint = Math.ceil(cards.length / 2);
    const leftCards = cards.slice(0, midpoint);
    const rightCards = cards.slice(midpoint);

    return (
      <>
        {/* Two-column layout for large screens */}
        <div className="hidden xl:flex gap-6">
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 w-fit">
            <table>
              <TableHeader
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <tbody>
                {leftCards.map((card, idx) => (
                  <CardRow
                    key={idx}
                    card={card}
                    onMouseEnter={onCardHover}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onCardLeave}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 w-fit">
            <table>
              <TableHeader
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <tbody>
                {rightCards.map((card, idx) => (
                  <CardRow
                    key={idx + midpoint}
                    card={card}
                    onMouseEnter={onCardHover}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onCardLeave}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Single column layout for small screens */}
        <div className="xl:hidden bg-gray-900 rounded-lg overflow-hidden border border-gray-800 w-fit">
          <table>
            <TableHeader
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <tbody>
              {cards.map((card, idx) => (
                <CardRow
                  key={idx}
                  card={card}
                  onMouseEnter={onCardHover}
                  onMouseMove={onMouseMove}
                  onMouseLeave={onCardLeave}
                />
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 w-fit">
      <table>
        <TableHeader
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <tbody>
          {cards.map((card, idx) => (
            <CardRow
              key={idx}
              card={card}
              onMouseEnter={onCardHover}
              onMouseMove={onMouseMove}
              onMouseLeave={onCardLeave}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};