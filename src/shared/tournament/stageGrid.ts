export const GROUP_LABELS = ["3-0", "0-3", "3-1", "1-3", "3-2", "2-3"] as const;

export type GroupLabel = (typeof GROUP_LABELS)[number];

export const STAGE_CELL_INDEXES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export type CellIndex = (typeof STAGE_CELL_INDEXES)[number];

export const STAGE_CELL_COUNT = STAGE_CELL_INDEXES.length;

export type StageGroup = {
  readonly label: GroupLabel;
  readonly cellIndexes: readonly CellIndex[];
};

export type StageRow = readonly [StageGroup, StageGroup];

export const STAGE_ROWS: readonly StageRow[] = [
  [
    { label: "3-0", cellIndexes: [0, 1] },
    { label: "0-3", cellIndexes: [2, 3] },
  ],
  [
    { label: "3-1", cellIndexes: [4, 5, 6] },
    { label: "1-3", cellIndexes: [7, 8, 9] },
  ],
  [
    { label: "3-2", cellIndexes: [10, 11, 12] },
    { label: "2-3", cellIndexes: [13, 14, 15] },
  ],
];

export const STAGE_GROUPS: readonly StageGroup[] = STAGE_ROWS.flat();

export const CELL_LABEL_MAP: Readonly<Record<CellIndex, GroupLabel>> =
  Object.fromEntries(
    STAGE_GROUPS.flatMap((group) =>
      group.cellIndexes.map((cellIndex) => [cellIndex, group.label]),
    ),
  ) as Record<CellIndex, GroupLabel>;
