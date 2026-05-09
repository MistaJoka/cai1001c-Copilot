import { redirect } from "next/navigation";

/** Alias route — canonical browse surface lives under `/learn/library`. */
export default function LibraryAliasPage() {
  redirect("/learn/library");
}
