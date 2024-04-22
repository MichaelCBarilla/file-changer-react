


export const useApi = (): {
  addItemToDb: (inputText: string, inputFilePath: string) => Promise<void>;
} => {

  const addItemToDb = async (inputText: string, inputFilePath: string): Promise<void> => {
    const apiUrl = import.meta.env.VITE_AWS_API_URL;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          inputText,
          inputFilePath,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
      } else {
        throw {message: 'error with response', response};
      }
    } catch (error) {
      console.error('error adding item to db:', error);
      throw error;
    }
  };


  return { addItemToDb };
};
