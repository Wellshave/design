# -*- coding: utf-8 -*-
"""Gedeeld: CSS-regels splitsen en van een scope voorzien."""
import re

def split_rules(css):
    """Loop op topniveau door de CSS en geef (soort, kop, body) terug."""
    out=[]; i=0; n=len(css)
    while i<n:
        # commentaar overslaan
        if css.startswith('/*',i):
            j=css.find('*/',i+2); i=(j+2) if j>=0 else n; continue
        if css[i] in ' \t\r\n': i+=1; continue
        j=i; depth=0
        while j<n and css[j]!='{': j+=1
        if j>=n: break
        kop=css[i:j].strip()
        k=j; depth=0
        while k<n:
            if css.startswith('/*',k):
                e=css.find('*/',k+2); k=(e+2) if e>=0 else n; continue
            if css[k]=='{': depth+=1
            elif css[k]=='}':
                depth-=1
                if depth==0: break
            k+=1
        lichaam=css[j+1:k]
        out.append((kop,lichaam))
        i=k+1
    return out

def prefix_sel(sel, scope):
    sel=sel.strip()
    if not sel: return sel
    if sel==':root': return scope
    if sel=='*': return scope+' *'
    if sel=='body' or sel=='html' or sel=='html,body': return scope
    if sel.startswith('body '): return scope+' '+sel[5:]
    if sel.startswith('body'): return scope+sel[4:]
    return scope+' '+sel

def scope_css(css, scope):
    uit=[]
    for kop,lichaam in split_rules(css):
        if kop.startswith('@'):
            naam=kop.split()[0].lower()
            if naam in ('@keyframes','@-webkit-keyframes','@font-face','@page'):
                uit.append(kop+'{'+lichaam+'}')
            else:  # @media, @supports
                uit.append(kop+'{'+scope_css(lichaam,scope)+'}')
        else:
            sels=[prefix_sel(s,scope) for s in kop.split(',')]
            uit.append(','.join(sels)+'{'+lichaam+'}')
    return '\n'.join(uit)

