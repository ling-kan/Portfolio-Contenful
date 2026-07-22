import React from "react";

const SkillsPanel = ({ list }) => {
  if (!list?.length) return null;

  const [feature, ...rest] = list;
  const formatIndex = (i) => String(i + 1).padStart(2, '0');

  return (
    <section className="px-6 pt-28 sm:px-12 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between border-t border-foreground/20 pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            — Craft &amp; Workflow
          </span>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="flex flex-col justify-between rounded-3xl bg-primary p-8 text-primary-foreground lg:row-span-2 lg:min-h-[420px]">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/60">
              {formatIndex(0)} — Discipline
            </span>
            <div>
              <h3 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                {feature.category}
              </h3>
              {feature.skills?.[0]?.description && (
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
                  {feature.skills[0].description}
                </p>
              )}
              <ul className="mt-6 flex flex-col gap-2.5">
                {feature.skills?.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex gap-3 text-sm leading-relaxed text-primary-foreground/85"
                  >
                    <span className="text-primary-foreground/50">—</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {rest.map((section, i) => {
              const dark = i === 1;
              return (
                <article
                  key={section.category}
                  className={`flex flex-col justify-between rounded-3xl border p-7 ${
                    dark
                      ? 'border-transparent bg-accent text-accent-foreground'
                      : 'border-border bg-card text-card-foreground'
                  }`}
                >
                  <div>
                    <span
                      className={`text-xs font-medium uppercase tracking-[0.16em] ${
                        dark ? 'text-accent-foreground/60' : 'text-muted-foreground'
                      }`}
                    >
                      {formatIndex(i + 1)}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">
                      {section.category}
                    </h3>
                    {section.skills?.[0]?.description && (
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          dark ? 'text-accent-foreground/75' : 'text-muted-foreground'
                        }`}
                      >
                        {section.skills[0].description}
                      </p>
                    )}
                  </div>
                  <ul className="mt-5 flex flex-col gap-2">
                    {section.skills?.map((skill) => (
                      <li
                        key={skill.name}
                        className={`flex gap-2.5 text-[13px] leading-relaxed ${
                          dark ? 'text-accent-foreground/85' : 'text-foreground/75'
                        }`}
                      >
                        <span
                          className={
                            dark
                              ? 'text-accent-foreground/50'
                              : 'text-muted-foreground'
                          }
                        >
                          —
                        </span>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsPanel;
