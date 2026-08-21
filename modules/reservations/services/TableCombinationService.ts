import type {
  AvailabilityTable,
} from "../repositories/availability.repository";

export type TableCombination = {
  tables: AvailabilityTable[];
  totalCapacity: number;
  tableCount: number;
  waste: number;
};

export class TableCombinationService {
  findBestCombination(
    tables: AvailabilityTable[],
    guests: number
  ): TableCombination | null {
    if (
      guests <= 0 ||
      tables.length === 0
    ) {
      return null;
    }

    const candidates = tables
      .filter(
        (table) => table.capacity > 0
      )
      .sort((a, b) => {
        if (
          a.capacity !== b.capacity
        ) {
          return a.capacity - b.capacity;
        }

        return a.code.localeCompare(
          b.code
        );
      });

    let best:
      | TableCombination
      | null = null;

    const search = (
      startIndex: number,
      selected: AvailabilityTable[],
      capacity: number
    ): void => {
      if (capacity >= guests) {
        const combination: TableCombination = {
          tables: [...selected],
          totalCapacity: capacity,
          tableCount: selected.length,
          waste: capacity - guests,
        };

        if (
          !best ||
          combination.waste < best.waste ||
          (
            combination.waste ===
              best.waste &&
            combination.tableCount <
              best.tableCount
          )
        ) {
          best = combination;
        }

        return;
      }

      if (
        startIndex >=
        candidates.length
      ) {
        return;
      }

      for (
        let index = startIndex;
        index < candidates.length;
        index += 1
      ) {
        const table =
          candidates[index];

        selected.push(table);

        search(
          index + 1,
          selected,
          capacity + table.capacity
        );

        selected.pop();
      }
    };

    search(0, [], 0);

    return best;
  }
}

export const tableCombinationService =
  new TableCombinationService();
