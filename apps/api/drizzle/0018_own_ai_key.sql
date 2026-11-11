CREATE TYPE "public"."llm_paid_by" AS ENUM('platform', 'learner');--> statement-breakpoint
CREATE TYPE "public"."ai_key_status" AS ENUM('ok', 'invalid');--> statement-breakpoint
CREATE TYPE "public"."ai_provider" AS ENUM('gemini', 'openai', 'openrouter');--> statement-breakpoint
CREATE TABLE "ai_keys" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"provider" "ai_provider" NOT NULL,
	"model" text NOT NULL,
	"sealed_key" text NOT NULL,
	"key_last4" text NOT NULL,
	"status" "ai_key_status" DEFAULT 'ok' NOT NULL,
	"last_error" text,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "llm_calls" ADD COLUMN "paid_by" "llm_paid_by" DEFAULT 'platform' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_keys" ADD CONSTRAINT "ai_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;