/**
 * Splits a localized heading into the leading phrase and its final highlighted word.
 */
export const splitCheckoutHeading = (title: string) => {
  const trimmedTitle = title.trim();
  const separatorIndex = trimmedTitle.lastIndexOf(' ');

  if (separatorIndex === -1) {
    return {
      leading: trimmedTitle,
      accent: '',
    };
  }

  return {
    leading: trimmedTitle.slice(0, separatorIndex),
    accent: trimmedTitle.slice(separatorIndex + 1),
  };
};

