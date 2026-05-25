import {
  type ResendTemplateAlias,
  type ResendTemplateDefinition,
  RESEND_TEMPLATES,
} from "./resendTemplates";

export type TemplateVariableValue = string | number;
export type TemplateVariableMap = Record<string, TemplateVariableValue>;

type RenderInput = {
  template: ResendTemplateDefinition;
  variables?: TemplateVariableMap;
};

const htmlEscapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEscapeMap[character] ?? character);
}

function replaceTripleBraces(
  template: string,
  variables: TemplateVariableMap,
  escapeValues: boolean,
) {
  return template.replace(/\{\{\{([A-Z0-9_]+)\}\}\}/g, (_, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) {
      return `{{{${key}}}}`;
    }

    const stringValue = String(value);
    return escapeValues ? escapeHtml(stringValue) : stringValue;
  });
}

function wantsPreferenceLinks(template: ResendTemplateDefinition) {
  return (
    template.requiredVariables.includes("PREFERENCES_LINK") &&
    template.requiredVariables.includes("UNSUBSCRIBE_LINK")
  );
}

function renderLogoUrl(variables: TemplateVariableMap) {
  const websiteUrl = replaceTripleBraces("{{{WEBSITE_URL}}}", variables, true).replace(/\/$/, "");
  return `${websiteUrl}/images/new-logo.png`;
}

function renderLogoHtml(variables: TemplateVariableMap) {
  const logoUrl = renderLogoUrl(variables);

  return `
    <div style="margin: 0 0 22px; text-align: center;">
      <img
        src="${logoUrl}"
        alt="Apex Wellness"
        width="320"
        style="display: block; width: 100%; max-width: 320px; height: auto; margin: 0 auto;"
      />
    </div>
  `;
}

function renderFooterHtml(template: ResendTemplateDefinition, variables: TemplateVariableMap) {
  const preferenceLinks = wantsPreferenceLinks(template)
    ? `
      <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: #5f738a;">
        Manage email preferences:
        <a href="${replaceTripleBraces("{{{PREFERENCES_LINK}}}", variables, true)}" style="color: #2c5db3; text-decoration: none;">
          ${replaceTripleBraces("{{{PREFERENCES_LINK}}}", variables, true)}
        </a><br />
        Unsubscribe:
        <a href="${replaceTripleBraces("{{{UNSUBSCRIBE_LINK}}}", variables, true)}" style="color: #2c5db3; text-decoration: none;">
          ${replaceTripleBraces("{{{UNSUBSCRIBE_LINK}}}", variables, true)}
        </a>
      </p>
    `
    : "";

  return `
    <div style="margin-top: 32px; border-top: 1px solid #dce6f4; padding-top: 20px;">
      <p style="margin: 0; font-size: 12px; line-height: 1.7; color: #5f738a;">
        <strong style="color: #14263f;">Apex Wellness</strong><br />
        ${replaceTripleBraces("{{{SUPPORT_EMAIL}}}", variables, true)}<br />
        ${replaceTripleBraces("{{{WEBSITE_URL}}}", variables, true)}
      </p>
      <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.7; color: #5f738a;">
        This message may contain account-related information. For your privacy, sensitive details are only available through your secure Apex Wellness account.
      </p>
      ${preferenceLinks}
    </div>
  `;
}

function renderFooterText(template: ResendTemplateDefinition, variables: TemplateVariableMap) {
  const preferenceLines = wantsPreferenceLinks(template)
    ? [
        "",
        `Manage email preferences: ${replaceTripleBraces("{{{PREFERENCES_LINK}}}", variables, false)}`,
        `Unsubscribe: ${replaceTripleBraces("{{{UNSUBSCRIBE_LINK}}}", variables, false)}`,
      ]
    : [];

  return [
    "",
    "Apex Wellness",
    replaceTripleBraces("{{{SUPPORT_EMAIL}}}", variables, false),
    replaceTripleBraces("{{{WEBSITE_URL}}}", variables, false),
    "",
    "This message may contain account-related information. For your privacy, sensitive details are only available through your secure Apex Wellness account.",
    ...preferenceLines,
  ].join("\n");
}

function renderBodyLinesHtml(template: ResendTemplateDefinition, variables: TemplateVariableMap) {
  return template.bodyLines
    .map(
      (line) =>
        `<p style="margin: 0 0 14px; font-size: 16px; line-height: 1.75; color: #203247;">${replaceTripleBraces(line, variables, true)}</p>`,
    )
    .join("");
}

function renderBodyLinesText(template: ResendTemplateDefinition, variables: TemplateVariableMap) {
  return template.bodyLines
    .map((line) => replaceTripleBraces(line, variables, false))
    .join("\n\n");
}

export function renderApexEmailHtml({ template, variables = {} }: RenderInput) {
  const previewText = replaceTripleBraces(template.previewText, variables, true);
  const ctaUrl = replaceTripleBraces(`{{{${template.ctaUrlVariable}}}}`, variables, true);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(template.subject)}</title>
  </head>
  <body style="margin: 0; padding: 24px 12px; background: linear-gradient(180deg, #f5f8fd 0%, #edf3fb 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #14263f;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; visibility: hidden;">${previewText}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center">
          <div style="max-width: 640px; margin: 0 auto;">
            ${renderLogoHtml(variables)}
            <div style="border: 1px solid #dce6f4; border-radius: 24px; background: #ffffff; box-shadow: 0 18px 48px rgba(20, 38, 63, 0.08); overflow: hidden;">
              <div style="padding: 36px 28px 32px;">
                <h1 style="margin: 0 0 12px; font-size: 28px; line-height: 1.2; color: #14263f;">${escapeHtml(template.subject)}</h1>
                <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.7; color: #5f738a;">${previewText}</p>
                <div>${renderBodyLinesHtml(template, variables)}</div>
                <div style="margin-top: 28px;">
                  <a
                    href="${ctaUrl}"
                    style="display: inline-block; border-radius: 999px; background: #2c5db3; color: #ffffff; padding: 14px 22px; font-size: 14px; font-weight: 600; text-decoration: none;"
                  >
                    ${escapeHtml(template.ctaLabel)}
                  </a>
                </div>
                ${renderFooterHtml(template, variables)}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderApexEmailText({ template, variables = {} }: RenderInput) {
  const headline = template.subject;
  const previewText = replaceTripleBraces(template.previewText, variables, false);
  const ctaLine = `${template.ctaLabel}: ${replaceTripleBraces(`{{{${template.ctaUrlVariable}}}}`, variables, false)}`;

  return [
    headline,
    "",
    previewText,
    "",
    renderBodyLinesText(template, variables),
    "",
    ctaLine,
    renderFooterText(template, variables),
  ].join("\n");
}

export function getResendTemplate(alias: ResendTemplateAlias) {
  return RESEND_TEMPLATES[alias];
}

export function renderApexTemplateByAlias(
  alias: ResendTemplateAlias,
  variables: TemplateVariableMap = {},
) {
  const template = getResendTemplate(alias);
  return {
    html: renderApexEmailHtml({ template, variables }),
    text: renderApexEmailText({ template, variables }),
  };
}
