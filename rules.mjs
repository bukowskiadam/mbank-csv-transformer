export const simpleDescriptionRule = (
  descriptionRegex,
  transferAccount,
  finalDescription
) => ({
  matches: (entry) => descriptionRegex.test(entry.combinedDescription),
  apply: (entry) => ({
    ...entry,
    transferAccount,
    finalDescription,
  }),
});
