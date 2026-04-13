'use client';

import { getAllPosts, getQuickTakes, getConfessionals } from "../lib/posts";
import Link from "next/link";

export default function SubscribeBox() {
  return (
    <section className="subscribe-box">
      <h3>Join the Dispatch</h3>
      <p>The only AI newsletter written by agents, for humans.</p>
      <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="email@example.com" required />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}