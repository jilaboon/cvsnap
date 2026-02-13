import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import { parseResumeText, ResumeSection } from './resume-parser';

// Colors matching the app's design
const colors = {
  primary: '#4f46e5',    // indigo-600
  textDark: '#1f2937',   // gray-800
  textLight: '#6b7280',  // gray-500
  divider: '#e5e7eb',    // gray-200
};

// Style factory — produces RTL-aware styles
function createStyles(isRTL: boolean) {
  const align = isRTL ? 'right' as const : 'left' as const;

  return StyleSheet.create({
    page: {
      paddingTop: 56,
      paddingBottom: 56,
      paddingHorizontal: 56,
      fontFamily: 'Helvetica',
      fontSize: 9,
      color: colors.textDark,
    },
    headerName: {
      fontSize: 20,
      fontFamily: 'Helvetica-Bold',
      color: colors.textDark,
      textAlign: 'center',
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 12,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 4,
    },
    headerContact: {
      fontSize: 9,
      color: colors.textLight,
      textAlign: 'center',
      marginBottom: 16,
    },
    sectionHeader: {
      marginTop: 12,
      marginBottom: 6,
      borderBottomWidth: 0.75,
      borderBottomColor: colors.divider,
      paddingBottom: 3,
    },
    sectionHeaderText: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: colors.primary,
      textAlign: align,
    },
    jobHeader: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color: colors.textDark,
      marginTop: 6,
      marginBottom: 3,
      textAlign: align,
    },
    bullet: {
      fontSize: 9,
      color: colors.textDark,
      paddingLeft: isRTL ? 0 : 10,
      paddingRight: isRTL ? 10 : 0,
      marginBottom: 1.5,
      textAlign: align,
    },
    plainText: {
      fontSize: 9,
      color: colors.textDark,
      marginBottom: 1.5,
      textAlign: align,
    },
  });
}

type Styles = ReturnType<typeof createStyles>;

// --- Internal components ---

function HeaderBlock({ section, styles }: { section: ResumeSection; styles: Styles }) {
  const nameAndTitle = section.content.slice(0, 2);
  const rest = section.content.slice(2);

  return (
    <View>
      {nameAndTitle[0] && <Text style={styles.headerName}>{nameAndTitle[0]}</Text>}
      {nameAndTitle[1] && <Text style={styles.headerTitle}>{nameAndTitle[1]}</Text>}
      {rest.length > 0 && <Text style={styles.headerContact}>{rest.join(' | ')}</Text>}
    </View>
  );
}

function ContentLine({ line, styles }: { line: string; styles: Styles }) {
  const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
  const isJobHeader = line.includes(' | ') && !isBullet;

  if (isBullet) {
    return <Text style={styles.bullet}>{'• ' + line.replace(/^[-•*]\s*/, '')}</Text>;
  }
  if (isJobHeader) {
    return <Text style={styles.jobHeader}>{line}</Text>;
  }
  return <Text style={styles.plainText}>{line}</Text>;
}

function SectionBlock({ section, styles }: { section: ResumeSection; styles: Styles }) {
  return (
    <View wrap={false}>
      {section.section && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{section.section}</Text>
        </View>
      )}
      {section.content.map((line, idx) => (
        <ContentLine key={idx} line={line} styles={styles} />
      ))}
    </View>
  );
}

function ResumePdf({ sections, isRTL }: { sections: ResumeSection[]; isRTL: boolean }) {
  const styles = createStyles(isRTL);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {sections.map((section, i) =>
          i === 0 && !section.section
            ? <HeaderBlock key={i} section={section} styles={styles} />
            : <SectionBlock key={i} section={section} styles={styles} />
        )}
      </Page>
    </Document>
  );
}

// --- Public API (same signature as before) ---

export async function createResumePdf(
  resumeText: string,
  isRTL: boolean = false
): Promise<Buffer> {
  const sections = parseResumeText(resumeText);
  const buffer = await renderToBuffer(
    <ResumePdf sections={sections} isRTL={isRTL} />
  );
  return Buffer.from(buffer);
}
