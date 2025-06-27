import { db } from "../utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";

export type WatchlistItem = {
  crypto: string;
  user: string;
};
const watchlistCollection = collection(db, "watchlist");
export async function addToWatchList(
  id: string,
  userId: string | undefined
): Promise<{ message: string; success?: boolean } | undefined> {
  try {
     await addDoc(watchlistCollection, {
      crypto: id,
      user: userId,
    });
    return {
      message: `${id} added to watchlist successfully.`,
    };
  } catch (error) {
    return {
      message: `Failed to add ${id} to watchlist.`,
      success: false,
    };
  }
}
export async function getWatchList(
  userId: string
): Promise<{ message: string; } | string[]> {
  try {
    const q = query(watchlistCollection, where("user", "==", userId));
    const querySnapshot = await getDocs(q);

    const watchlistItems: WatchlistItem[] = [];
    querySnapshot.forEach((doc) => {
      watchlistItems.push(doc.data() as WatchlistItem);
    });
    const userWatchList = watchlistItems.map((item) => item.crypto);
    return userWatchList;
  } catch (error) {
    return {
      message: `Failed to fetch watchlist for user ${userId}.`,
    };
  }
}
export async function removeFromWatchList(
  id: string,
  userId: string | undefined
): Promise<{ message: string; success: boolean } | undefined> {
  try {
    const q = query(
      watchlistCollection,
      where("crypto", "==", id),
      where("user", "==", userId)
    );
    const querySnapshot = await getDocs(q);
	  if (querySnapshot.docs.length === 0) {
	  return {
		message: `${id} not found in watchlist.`,
		success: false,
	  };
	}
    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef);
    return {
      message: `${id} removed from watchlist successfully.`,
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to remove ${id} from watchlist.`,
      success: false,
    };
  }
}
