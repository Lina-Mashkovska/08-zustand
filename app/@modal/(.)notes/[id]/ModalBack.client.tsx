"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";

export default function ModalBack({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Modal isOpen onClose={() => router.back()}>
      {children}
    </Modal>
  );
}
